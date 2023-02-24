-- see https://www.peterullrich.com/complete-guide-to-full-text-search-with-postgres-and-ecto#one-index-for-all-languages
CREATE FUNCTION lang_to_regconfig(text) RETURNS regconfig
    LANGUAGE sql IMMUTABLE STRICT AS $$
    SELECT $1::regconfig; $$