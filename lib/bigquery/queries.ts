export const TOTAL_REVENUE_24 = `SELECT CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
  ON p.post_id = c.publication_id
WHERE c.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)`;

export const TOTAL_REVENUE_48 = `SELECT CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
  ON p.post_id = c.publication_id
  WHERE c.block_timestamp BETWEEN TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR) AND TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)`;

export const UNIQUE_COLLECTS_24 = `SELECT p.handle, COUNT(DISTINCT c.post_id) AS unique_collects_24h,
MAX(c.block_timestamp) AS latest_block_timestamp, 
p.profile_picture_s3_url
FROM lens-public-data.polygon.public_collect_post_nft_ownership AS c
JOIN lens-public-data.polygon.public_profile AS p ON c.owner_address = p.owned_by
WHERE c.block_timestamp BETWEEN TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR) AND CURRENT_TIMESTAMP()
GROUP BY p.handle, p.profile_picture_s3_url
ORDER BY unique_collects_24h DESC, p.handle ASC
LIMIT 50
`;

export const TOTAL_POST_W_REVENUE_24 = `SELECT 
p.post_id, 
CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
ON p.post_id = c.publication_id
WHERE c.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
GROUP BY p.post_id
HAVING total_amount IS NOT NULL`;

export const TOTAL_POST_W_REVENUE_48 = `SELECT 
p.post_id, 
CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
ON p.post_id = c.publication_id
WHERE c.block_timestamp BETWEEN TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR) AND TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
GROUP BY p.post_id
HAVING total_amount IS NOT NULL`;

export const TOP_FOLLOWED_ACCOUNTS_48 = `SELECT 
f.giver_profile_id, 
COUNT(*) AS count,
MAX(f.block_timestamp) AS last_timestamp,
p.handle
FROM lens-public-data.polygon.public_follow_nft_ownership f
JOIN lens-public-data.polygon.public_profile p
ON f.giver_profile_id = p.profile_id
WHERE f.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR)
GROUP BY f.giver_profile_id, p.handle
ORDER BY count DESC
LIMIT 12
`;

export const TOP_50_COLLECTORS_ALL_TIME = `SELECT p.handle, s.total_collects, p.profile_picture_s3_url
FROM lens-public-data.polygon.public_profile_stats AS s
JOIN lens-public-data.polygon.public_profile AS p ON s.profile_id = p.profile_id
ORDER BY s.total_collects DESC
LIMIT 50
`;

export const TOP_50_MIRRORS_ALL_TIME = `SELECT p.handle, s.total_mirrors, p.profile_picture_s3_url
FROM lens-public-data.polygon.public_profile_stats AS s
JOIN lens-public-data.polygon.public_profile AS p ON s.profile_id = p.profile_id
ORDER BY s.total_mirrors DESC
LIMIT 50
`;

export const TOP_50_POSTERS_ALL_TIME = `SELECT p.handle, s.total_posts, p.profile_picture_s3_url
FROM lens-public-data.polygon.public_profile_stats AS s
JOIN lens-public-data.polygon.public_profile AS p ON s.profile_id = p.profile_id
ORDER BY s.total_posts DESC
LIMIT 50
`;

export const AMOUNT_TO_NO_COLLECTORS_ALL_TIME = `SELECT ppd.publication_id, ppd.amount, pps.total_amount_of_collects
FROM (
  SELECT publication_id, amount
  FROM lens-public-data.polygon.public_publication_collect_module_details
  WHERE amount != ''
  ORDER BY amount DESC
) ppd
JOIN (
  SELECT publication_id, total_amount_of_collects
  FROM lens-public-data.polygon.public_publication_stats
  WHERE total_amount_of_collects != 0
  ORDER BY total_amount_of_collects DESC
) pps
ON ppd.publication_id = pps.publication_id
ORDER BY pps.total_amount_of_collects DESC
LIMIT 100
`;

export const AMOUNT_TO_NO_COLLECTORS_72 = `
SELECT ppd.publication_id, ppd.amount, ppd.block_timestamp, pps.total_amount_of_collects
FROM (
  SELECT publication_id, amount, block_timestamp
  FROM lens-public-data.polygon.public_publication_collect_module_details
  WHERE block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 72 HOUR)
    AND amount != ''
  ORDER BY amount DESC
) ppd
JOIN (
  SELECT publication_id, total_amount_of_collects
  FROM lens-public-data.polygon.public_publication_stats
  WHERE total_amount_of_collects != 0
  ORDER BY total_amount_of_collects DESC
) pps
ON ppd.publication_id = pps.publication_id
ORDER BY pps.total_amount_of_collects DESC
LIMIT 100
`;

export const HIGHEST_COLLECTOR_SPEND_72 = `
SELECT 
  COUNT(DISTINCT c.publication_id) AS num_posts, 
  CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount, 
  COALESCE(pr.handle, 'Unknown') AS handle,
  pr.profile_picture_s3_url,
  c.block_timestamp
FROM 
  lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN 
  lens-public-data.polygon.public_publication_collect_module_details c ON p.post_id = c.publication_id
JOIN 
  lens-public-data.polygon.public_profile pr ON p.owner_address = pr.owned_by
WHERE 
  c.amount > '0'
  AND c.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 72 HOUR)
GROUP BY 
  p.owner_address, pr.handle, pr.profile_picture_s3_url, c.block_timestamp
ORDER BY 
  total_amount DESC
LIMIT 50
`;

export const HASHTAGS_TOP = `SELECT hashtag, COUNT(*) as count
FROM lens-public-data.polygon.public_hashtag
GROUP BY hashtag
ORDER BY count DESC
LIMIT 16`;

export const INTERESTS_TOP = `SELECT interest, COUNT(*) as count
FROM lens-public-data.polygon.public_profile_interest_record
GROUP BY interest
ORDER BY count DESC
LIMIT 16
`;

export const MUSIC = `SELECT d.amount, p.post_id, s.total_amount_of_collects, CAST(d.amount AS BIGNUMERIC) * s.total_amount_of_collects AS total_amount, pr.handle, pr.profile_picture_s3_url
FROM lens-public-data.polygon.public_profile_post p
JOIN lens-public-data.polygon.public_publication_collect_module_details d
ON p.post_id = d.publication_id
JOIN lens-public-data.polygon.public_publication_stats s
ON p.post_id = s.publication_id
JOIN lens-public-data.polygon.public_profile pr
ON p.profile_id = pr.profile_id
WHERE p.main_content_focus LIKE '%AUDIO%' AND CAST(d.amount AS BIGNUMERIC) > 0 AND p.is_related_to_post IS NULL
ORDER BY total_amount DESC
LIMIT 16`;

export const ART = `SELECT d.amount, p.post_id, s.total_amount_of_collects, CAST(d.amount AS BIGNUMERIC) * s.total_amount_of_collects AS total_amount, pr.handle, pr.profile_picture_s3_url
FROM lens-public-data.polygon.public_profile_post p
JOIN lens-public-data.polygon.public_publication_collect_module_details d
ON p.post_id = d.publication_id
JOIN lens-public-data.polygon.public_publication_stats s
ON p.post_id = s.publication_id
JOIN lens-public-data.polygon.public_profile pr
ON p.profile_id = pr.profile_id
WHERE p.main_content_focus LIKE '%IMAGE%' AND CAST(d.amount AS BIGNUMERIC) > 0 AND p.is_related_to_post IS NULL
ORDER BY total_amount DESC
LIMIT 16`;

export const VIDEO = `SELECT d.amount, p.post_id, s.total_amount_of_collects, CAST(d.amount AS BIGNUMERIC) * s.total_amount_of_collects AS total_amount, pr.handle, pr.profile_picture_s3_url
FROM lens-public-data.polygon.public_profile_post p
JOIN lens-public-data.polygon.public_publication_collect_module_details d
ON p.post_id = d.publication_id
JOIN lens-public-data.polygon.public_publication_stats s
ON p.post_id = s.publication_id
JOIN lens-public-data.polygon.public_profile pr
ON p.profile_id = pr.profile_id
WHERE p.main_content_focus LIKE '%VIDEO%' AND CAST(d.amount AS BIGNUMERIC) > 0 AND p.is_related_to_post IS NULL
ORDER BY total_amount DESC
LIMIT 16`;
