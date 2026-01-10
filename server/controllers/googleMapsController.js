import axios from 'axios';
import { PreSchool, PreSchoolImage, AdmissionDetail, FranchiseDetail } from '../models/index.js';

const GOOGLE_PLACES_API_BASE = process.env.GOOGLE_PLACES_API_BASE;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const SEARCH_KEYWORDS = [
  'preschool',
  'pre-school',
  'play school',
  'nursery',
  'kindergarten',
];

export const fetchFromGoogleMaps = async (req, res) => {
  try {
    const { location, radius = 10000 } = req.validated;

    // Get coordinates from location string
    const geocodeUrl = `${GOOGLE_PLACES_API_BASE}/geocode/json`;
    const geocodeResponse = await axios.get(geocodeUrl, {
      params: {
        address: location,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (
      geocodeResponse.data.status !== 'OK' ||
      geocodeResponse.data.results.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Location not found',
      });
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
    let totalAdded = 0;
    let totalSkipped = 0;

    // Search for each keyword
    for (const keyword of SEARCH_KEYWORDS) {
      const nearbyUrl = `${GOOGLE_PLACES_API_BASE}/place/nearbysearch/json`;

      let nextPageToken = null;
      let pageCount = 0;

      do {
        try {
          const params = {
            location: `${lat},${lng}`,
            radius,
            type: 'school',
            keyword,
            key: GOOGLE_MAPS_API_KEY,
          };

          if (nextPageToken) {
            params.pagetoken = nextPageToken;
            // Wait 2 seconds for pagination
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          const nearbyResponse = await axios.get(nearbyUrl, { params });

          if (nearbyResponse.data.status !== 'OK') {
            break;
          }

          // Process results
          for (const place of nearbyResponse.data.results) {
            try {
              const existing = await PreSchool.findOne({
                where: { google_place_id: place.place_id },
              });

              if (!existing) {
                // Fetch detailed information
                const detailUrl = `${GOOGLE_PLACES_API_BASE}/place/details/json`;
                const detailResponse = await axios.get(detailUrl, {
                  params: {
                    place_id: place.place_id,
                    fields:
                      'name,formatted_address,formatted_phone_number,website,photos,rating,reviews',
                    key: GOOGLE_MAPS_API_KEY,
                  },
                });

                if (detailResponse.data.status === 'OK') {
                  const detail = detailResponse.data.result;

                  // Extract address components
                  const addressResponse = await axios.get(geocodeUrl, {
                    params: {
                      latlng: `${place.geometry.location.lat},${place.geometry.location.lng}`,
                      key: GOOGLE_MAPS_API_KEY,
                    },
                  });

                  let city = '';
                  let state = '';
                  let pincode = '';

                  if (addressResponse.data.results.length > 0) {
                    const addressComponents =
                      addressResponse.data.results[0].address_components;
                    city =
                      addressComponents.find((c) =>
                        c.types.includes('locality')
                      )?.long_name || '';
                    state =
                      addressComponents.find((c) =>
                        c.types.includes('administrative_area_level_1')
                      )?.long_name || '';
                    pincode =
                      addressComponents.find((c) =>
                        c.types.includes('postal_code')
                      )?.long_name || '';
                  }

                  // Create preschool
                  const preschool = await PreSchool.create({
                    name: detail.name,
                    address: detail.formatted_address,
                    city,
                    state,
                    pincode,
                    phone: detail.formatted_phone_number,
                    website: detail.website,
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                    google_place_id: place.place_id,
                    verified_status: false,
                  });

                  // Add images from Google
                  if (detail.photos && detail.photos.length > 0) {
                    const imageUrl = `${GOOGLE_PLACES_API_BASE}/place/photo`;
                    for (let i = 0; i < Math.min(detail.photos.length, 3); i++) {
                      const photoUrl = `${imageUrl}?maxwidth=400&maxheight=400&photoreference=${detail.photos[i].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`;

                      await PreSchoolImage.create({
                        preschool_id: preschool.id,
                        image_url: photoUrl,
                        is_primary: i === 0,
                      });
                    }
                  }

                  // Create admission and franchise records
                  await AdmissionDetail.create({
                    preschool_id: preschool.id,
                    verified_rating:
                      detail.rating && parseFloat(detail.rating) > 0
                        ? parseFloat(detail.rating)
                        : 0,
                  });

                  await FranchiseDetail.create({
                    preschool_id: preschool.id,
                  });

                  totalAdded++;
                }
              } else {
                totalSkipped++;
              }
            } catch (err) {
              console.error('Error processing place:', err.message);
              totalSkipped++;
            }
          }

          nextPageToken = nearbyResponse.data.next_page_token;
          pageCount++;
        } catch (err) {
          console.error('Error in pagination:', err.message);
          break;
        }
      } while (nextPageToken && pageCount < 3);
    }

    return res.status(200).json({
      success: true,
      message: 'PreSchools fetched from Google Maps',
      data: {
        added: totalAdded,
        skipped: totalSkipped,
        total: totalAdded + totalSkipped,
      },
    });
  } catch (error) {
    console.error('Error fetching from Google Maps:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching from Google Maps',
      error: error.message,
    });
  }
};

export const searchGooglePlaces = async (req, res) => {
  try {
    const { query, location } = req.query;

    if (!query || !location) {
      return res.status(400).json({
        success: false,
        message: 'Query and location are required',
      });
    }

    // Get coordinates from location
    const geocodeUrl = `${GOOGLE_PLACES_API_BASE}/geocode/json`;
    const geocodeResponse = await axios.get(geocodeUrl, {
      params: {
        address: location,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (geocodeResponse.data.status !== 'OK') {
      return res.status(400).json({
        success: false,
        message: 'Location not found',
      });
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    // Search nearby
    const nearbyUrl = `${GOOGLE_PLACES_API_BASE}/place/nearbysearch/json`;
    const response = await axios.get(nearbyUrl, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,
        keyword: query,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    return res.status(200).json({
      success: true,
      data: response.data.results || [],
    });
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching Google Places',
      error: error.message,
    });
  }
};
