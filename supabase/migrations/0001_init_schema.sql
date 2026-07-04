-- Create users table (Next-Auth credentials authentication compatible)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hobby_id VARCHAR(50) NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, hobby_id)
);

-- Insert fixed hobbies data (18 types)
INSERT INTO hobbies (id, name, category, image_url) VALUES
('jogging', '조깅/러닝', 'sports', '/thumbnails/running.jpg'),
('yoga', '요가', 'sports', '/thumbnails/yoga.jpg'),
('swimming', '수영', 'sports', '/thumbnails/swimming.jpg'),
('cycling', '자전거', 'sports', '/thumbnails/cycling.jpg'),
('climbing', '클라이밍', 'sports', '/thumbnails/climbing.jpg'),
('dancing', '댄스', 'sports', '/thumbnails/dance.jpg'),
('reading', '독서', 'intelligence', '/thumbnails/reading.jpg'),
('puzzle', '퍼즐', 'intelligence', '/thumbnails/puzzle.jpg'),
('chess', '체스', 'intelligence', '/thumbnails/chess.jpg'),
('programming', '프로그래밍', 'intelligence', '/thumbnails/programming.jpg'),
('language', '외국어 학습', 'intelligence', '/thumbnails/foreign_language_learning.jpg'),
('photography', '사진 촬영', 'intelligence', '/thumbnails/photography.jpg'),
('painting', '그림 그리기', 'art', '/thumbnails/drawing.jpg'),
('music', '악기 연주', 'art', '/thumbnails/instrument_playing.jpg'),
('cooking', '요리', 'art', '/thumbnails/cooking.jpg'),
('calligraphy', '서예', 'art', '/thumbnails/calligraphy.jpg'),
('pottery', '도자기 만들기', 'art', '/thumbnails/pottery.jpg'),
('gardening', '정원 가꾸기', 'art', '/thumbnails/gardening.jpg')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    image_url = EXCLUDED.image_url;
