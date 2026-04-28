-- ============================================================
-- IMDB CLONE — DỮ LIỆU MẪU
-- Chạy AFTER khi Spring Boot đã khởi động (Hibernate tạo bảng xong)
-- Mật khẩu tất cả tài khoản: password
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ════════════════════════════════════════════
-- 1. ROLES
-- ════════════════════════════════════════════
INSERT INTO role (id, name) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN');

-- ════════════════════════════════════════════
-- 2. USERS  (1 admin + 15 thành viên)
-- BCrypt của "password":
-- $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ════════════════════════════════════════════
INSERT INTO users (id, first_name, last_name, email, password, enabled, status, provider, otp_attempts, created_at) VALUES
(1,  'Admin',   'IMDB',     'admin@imdb.vn',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-01-01 08:00:00'),
(2,  'Minh',    'Nguyễn',   'minhnguyen@gmail.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-01-10 09:00:00'),
(3,  'Hương',   'Trần',     'huongtran@gmail.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-01-12 10:15:00'),
(4,  'Tuấn',    'Lê',       'tuanle@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-01-15 11:30:00'),
(5,  'Linh',    'Phạm',     'linhpham@gmail.com',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-01-18 14:00:00'),
(6,  'Dũng',    'Hoàng',    'dunghoang@gmail.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-01-20 16:45:00'),
(7,  'Thảo',    'Vũ',       'thaovu@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'WARNING', 'LOCAL',  0, '2026-01-22 08:30:00'),
(8,  'Nam',     'Đặng',     'namdang@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-01-25 09:45:00'),
(9,  'Mai',     'Bùi',      'maibui@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-02-01 13:00:00'),
(10, 'Khoa',    'Đỗ',       'khoadoo@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-02-05 15:20:00'),
(11, 'Phương',  'Ngô',      'phuongngo@gmail.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'WARNING', 'LOCAL',  0, '2026-02-10 10:00:00'),
(12, 'Hùng',    'Tạ',       'hungta@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'BANNED',  'LOCAL',  0, '2026-02-14 11:30:00'),
(13, 'Quỳnh',   'Lý',       'quynhly@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'GOOGLE', 0, '2026-02-20 09:00:00'),
(14, 'Bảo',     'Đinh',     'baodinh@gmail.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-03-01 14:00:00'),
(15, 'Yến',     'Cao',      'yencao@gmail.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'GOOGLE', 0, '2026-03-15 16:00:00'),
(16, 'Thịnh',   'Trần',     'thinhtranhan21@gmail.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, 'ACTIVE',  'LOCAL',  0, '2026-03-20 08:00:00');

-- ════════════════════════════════════════════
-- 3. USER_ROLE
-- ════════════════════════════════════════════
INSERT INTO users_roles (user_id, roles_id) VALUES
(1, 1),(1, 2),
(2, 1),(3, 1),(4, 1),(5, 1),(6, 1),(7, 1),(8, 1),
(9, 1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1);

-- ════════════════════════════════════════════
-- 4. REVIEWS  (80 reviews, 20 phim TMDB)
-- movie_id = TMDB ID thực tế
-- 278  Shawshank Redemption      238  The Godfather
-- 240  Godfather Part II         424  Schindler's List
-- 680  Pulp Fiction              13   Forrest Gump
-- 550  Fight Club                27205 Inception
-- 157336 Interstellar            155  The Dark Knight
-- 603  The Matrix                372058 Your Name
-- 19995 Avatar                   299534 Avengers: Endgame
-- 315162 Puss in Boots           569094 Spider-Verse
-- 496243 Parasite                129  Spirited Away
-- 475557 Joker                   10681 WALL-E
-- ════════════════════════════════════════════
INSERT INTO reviews (id, movie_id, user_id, content, rating, like_count, dislike_count, is_edited, hidden, created_at) VALUES
-- ── 278 Shawshank Redemption ──────────────────────────────
(1,  278, 2,  'Bộ phim hay nhất tôi từng xem. Andy Dufresne là biểu tượng của hy vọng và kiên trì. Kết phim để lại cảm xúc lâu dài không thể quên.', 10, 7, 0, FALSE, FALSE, '2026-01-20 10:00:00'),
(2,  278, 3,  'Morgan Freeman diễn xuất quá đỉnh. Câu chuyện về hy vọng và tự do khiến tôi rơi nước mắt không kiểm soát được.', 10, 3, 0, FALSE, FALSE, '2026-01-22 14:30:00'),
(3,  278, 5,  'Phim cổ điển không bao giờ lỗi thời. Xem đi xem lại nhiều lần vẫn cảm thấy hay như lần đầu.', 9,  2, 0, FALSE, FALSE, '2026-02-01 09:00:00'),
(4,  278, 8,  'Cốt truyện rất hay nhưng hơi chậm ở phần đầu. Nửa sau thì cuốn đến không dứt ra được.', 8,  0, 0, FALSE, FALSE, '2026-02-15 20:00:00'),
(70, 278, 14, 'Phim hay đến mức tôi đã xem 4 lần và mỗi lần vẫn cảm xúc như lần đầu tiên.', 10, 7, 0, FALSE, FALSE, '2026-04-05 16:00:00'),

-- ── 238 The Godfather ─────────────────────────────────────
(5,  238, 2,  'Don Corleone là nhân vật huyền thoại. Marlon Brando diễn xuất thần. Đây là kiệt tác điện ảnh của mọi thời đại.', 10, 5, 0, FALSE, FALSE, '2026-01-25 11:00:00'),
(6,  238, 4,  'Từng khung hình đều như một tác phẩm nghệ thuật. Kịch bản hoàn hảo, diễn xuất hoàn hảo, không có gì để chê.', 10, 2, 0, FALSE, FALSE, '2026-02-02 15:00:00'),
(7,  238, 6,  'Bộ phim gangster hay nhất từ trước đến nay. Make him an offer he can\'t refuse — câu nói iconic nhất lịch sử.', 9,  1, 1, FALSE, FALSE, '2026-02-10 18:30:00'),
(8,  238, 9,  'Xem phim này mới hiểu tại sao nó được coi là số 1 mọi thời đại. Xuất sắc ở mọi khía cạnh.', 10, 0, 0, FALSE, FALSE, '2026-02-20 21:00:00'),
(71, 238, 15, 'Al Pacino và Marlon Brando là hai diễn viên vĩ đại nhất Hollywood. Phim xứng đáng 10/10 không tranh cãi.', 10, 9, 0, FALSE, FALSE, '2026-04-08 19:00:00'),

-- ── 240 Godfather Part II ─────────────────────────────────
(9,  240, 3,  'Phần 2 còn hay hơn phần 1 — điều cực kỳ hiếm gặp. Al Pacino và Robert De Niro đều ở đỉnh cao phong độ.', 10, 9, 0, FALSE, FALSE, '2026-02-01 10:00:00'),
(10, 240, 5,  'Câu chuyện hai thế hệ đan xen nhau rất khéo léo. Kết phim bi tráng không kém phần 1 chút nào.', 9,  1, 1, FALSE, FALSE, '2026-02-18 16:00:00'),

-- ── 424 Schindler's List ──────────────────────────────────
(11, 424, 4,  'Phim này không chỉ là nghệ thuật mà còn là bài học lịch sử sâu sắc. Xem xong không thể không khóc.', 10, 13, 0, FALSE, FALSE, '2026-02-05 19:00:00'),
(12, 424, 7,  'Spielberg đã tạo ra một tác phẩm bất hủ. Cảnh cô bé áo đỏ ám ảnh tôi mãi không quên được.', 10, 10, 0, FALSE, FALSE, '2026-02-22 14:00:00'),
(13, 424, 10, 'Phim đen trắng nhưng đầy màu sắc cảm xúc. Một trong những phim hay nhất viết về Thế chiến II.', 9,  0, 0, FALSE, FALSE, '2026-03-05 11:00:00'),
(75, 424, 15, 'Xem Schindler\'s List là nghĩa vụ của mỗi người để không bao giờ quên lịch sử nhân loại.', 10, 8, 0, FALSE, FALSE, '2026-04-18 15:00:00'),

-- ── 680 Pulp Fiction ──────────────────────────────────────
(14, 680, 2,  'Quentin Tarantino là thiên tài. Cách kể chuyện phi tuyến tính này thật sự cách mạng hóa điện ảnh.', 10, 11, 1, FALSE, FALSE, '2026-01-28 20:00:00'),
(15, 680, 6,  'Dialogue trong phim này đỉnh quá. Uma Thurman và John Travolta quá ăn ý với nhau.', 9,  0, 0, FALSE, FALSE, '2026-02-12 17:00:00'),
(16, 680, 11, 'Phim hơi bạo lực và tục tĩu với tôi nhưng không thể phủ nhận tài năng xuất chúng của đạo diễn.', 7,  0, 4, FALSE, FALSE, '2026-03-08 13:00:00'),
(74, 680, 14, 'Pulp Fiction là bằng chứng rằng cách kể chuyện quan trọng hơn bản thân nội dung câu chuyện.', 9,  5, 1, FALSE, FALSE, '2026-04-16 21:00:00'),

-- ── 13 Forrest Gump ───────────────────────────────────────
(17, 13, 3,  'Life is like a box of chocolates. Tom Hanks diễn xuất cảm động đến mức tôi khóc suốt từ đầu đến cuối.', 10, 14, 0, FALSE, FALSE, '2026-01-30 21:00:00'),
(18, 13, 5,  'Bộ phim ấm lòng nhất tôi từng xem. Mỗi lần buồn tôi lại lấy phim này ra xem để cảm thấy tốt hơn.', 10, 10, 0, FALSE, FALSE, '2026-02-08 15:30:00'),
(19, 13, 8,  'Forrest Gump chứng minh rằng trái tim trong sáng và tình yêu thật sự quan trọng hơn trí thông minh.', 9,  6, 0, FALSE, FALSE, '2026-02-25 10:00:00'),
(20, 13, 14, 'Câu chuyện lịch sử nước Mỹ được nhìn qua góc độ độc đáo và đầy cảm xúc. Nhiều đoạn cực kỳ cảm động.', 9,  5, 1, FALSE, FALSE, '2026-03-20 18:00:00'),

-- ── 550 Fight Club ────────────────────────────────────────
(21, 550, 4,  'The first rule of Fight Club: không được nói về Fight Club. Plot twist cuối phim điên loạn và xuất sắc.', 9,  10, 0, FALSE, FALSE, '2026-02-05 22:00:00'),
(22, 550, 9,  'Brad Pitt trong vai Tyler Durden quá charismatic. Phim ám ảnh tâm lý rất sâu sắc và khó quên.', 9,  7, 1, FALSE, FALSE, '2026-02-28 19:30:00'),
(23, 550, 13, 'Phim này cần xem 2 lần mới hiểu hết. Thông điệp về chủ nghĩa tiêu thụ rất thú vị và sâu sắc.', 8,  5, 0, FALSE, FALSE, '2026-03-15 20:00:00'),

-- ── 27205 Inception ───────────────────────────────────────
(24, 27205, 2,  'Christopher Nolan là đạo diễn thiên tài. Ý tưởng về giấc mơ trong giấc mơ trong giấc mơ quá sáng tạo.', 10, 6, 0, FALSE, FALSE, '2026-02-10 14:00:00'),
(25, 27205, 5,  'Phim xem xong phải ngồi suy nghĩ mãi không thôi. Cái kết mở gây tranh cãi nhưng rất thú vị.', 9,  2, 1, FALSE, FALSE, '2026-02-20 16:00:00'),
(26, 27205, 7,  'Visual effects đỉnh, cốt truyện phức tạp nhưng hoàn toàn logic. DiCaprio diễn hay như thường lệ.', 9,  6, 0, FALSE, FALSE, '2026-03-01 11:00:00'),
(27, 27205, 10, 'Inception thay đổi cách tôi nghĩ về phim ảnh. Xem lần 3 vẫn phát hiện ra chi tiết mới thú vị.', 10, 8, 0, FALSE, FALSE, '2026-03-10 20:00:00'),
(72, 27205, 14, 'Inception thực chất rất logic nếu bạn thật sự chú ý. Lần 2 xem mới hiểu hết toàn bộ câu chuyện.', 9,  4, 0, FALSE, FALSE, '2026-04-12 20:00:00'),

-- ── 157336 Interstellar ───────────────────────────────────
(28, 157336, 3,  'Phim khoa học viễn tưởng hay nhất từ trước đến nay. Nhạc phim của Hans Zimmer làm tôi nổi da gà.', 10, 12, 0, FALSE, FALSE, '2026-02-14 19:00:00'),
(29, 157336, 6,  'Tình yêu vượt qua thời gian và không gian. Matthew McConaughey diễn xuất cảm động không tả được.', 9,  8, 1, FALSE, FALSE, '2026-03-02 15:00:00'),
(30, 157336, 14, 'Concept về thuyết tương đối và chiều không gian thứ tư rất khó hiểu nhưng hấp dẫn vô cùng.', 8,  5, 2, FALSE, FALSE, '2026-03-22 10:00:00'),

-- ── 155 The Dark Knight ───────────────────────────────────
(31, 155, 4,  'Heath Ledger là Joker tốt nhất mọi thời đại. Màn trình diễn của anh ấy xứng đáng giành Oscar và hơn thế nữa.', 10, 7, 0, FALSE, FALSE, '2026-01-22 20:00:00'),
(32, 155, 8,  'Phim siêu anh hùng nhưng nặng về triết lý và tâm lý. Một trong những phim xuất sắc nhất thập kỷ qua.', 10, 2, 0, FALSE, FALSE, '2026-02-08 21:00:00'),
(33, 155, 12, 'Tại sao người tốt phải chịu đựng trong khi kẻ xấu tung hoành? Joker đặt ra câu hỏi này cực kỳ hay.', 9,  1, 1, FALSE, FALSE, '2026-02-25 17:30:00'),
(34, 155, 15, 'Nolan làm tốt nhất ở phim này. Từng chi tiết đều có ý nghĩa và hoàn toàn logic về mặt tự sự.', 10, 9, 0, FALSE, FALSE, '2026-03-18 12:00:00'),
(73, 155, 11, 'Heath Ledger là lý do duy nhất tôi xem phim siêu anh hùng. RIP huyền thoại điện ảnh.', 10, 7, 0, FALSE, FALSE, '2026-04-14 18:00:00'),

-- ── 603 The Matrix ────────────────────────────────────────
(35, 603, 5,  'Phim đã thay đổi lịch sử điện ảnh. Red pill hay blue pill? Câu hỏi triết học sâu sắc nhất màn ảnh.', 10, 11, 0, FALSE, FALSE, '2026-02-18 20:00:00'),
(36, 603, 9,  'Bullet time vẫn đỉnh dù đã gần 30 năm. Keanu Reeves sinh ra để đóng vai Neo.', 9,  7, 0, FALSE, FALSE, '2026-03-05 19:00:00'),
(37, 603, 13, 'Phim action tốt nhất từ trước đến nay kết hợp với triết học cyberpunk cực kỳ hay.', 9,  6, 1, FALSE, FALSE, '2026-03-20 22:00:00'),
(76, 603, 4,  'Ma trận thực ra là ẩn dụ về bản chất của thực tại. Phim sâu hơn vẻ ngoài rất rất nhiều.', 9,  6, 0, FALSE, FALSE, '2026-04-20 17:00:00'),

-- ── 372058 Your Name ──────────────────────────────────────
(38, 372058, 3,  'Anime đẹp nhất mà tôi từng xem. Phong cảnh Nhật Bản được vẽ tinh tế đến từng chi tiết nhỏ nhất.', 10, 5, 0, FALSE, FALSE, '2026-02-20 15:00:00'),
(39, 372058, 7,  'Câu chuyện tình yêu vượt thời gian cảm động vô cùng. Nhạc phim của RADWIMPS quá hay và phù hợp.', 10, 1, 0, FALSE, FALSE, '2026-03-08 16:00:00'),
(40, 372058, 11, 'Makoto Shinkai là đạo diễn anime xuất sắc nhất hiện nay. Phim này là bằng chứng không thể chối cãi.', 9,  1, 1, FALSE, FALSE, '2026-03-25 11:00:00'),
(41, 372058, 15, 'Xem xong khóc ngon lành. Tình yêu trong anime Nhật Bản luôn được kể theo cách đặc biệt và tinh tế.', 9,  8, 0, FALSE, FALSE, '2026-04-01 14:00:00'),
(77, 372058, 2,  'Your Name là lý do tôi bắt đầu xem anime. Phim đẹp đến mức không thể tả bằng lời được.', 10, 11, 0, FALSE, FALSE, '2026-04-22 14:00:00'),

-- ── 19995 Avatar ──────────────────────────────────────────
(42, 19995, 4,  'Công nghệ CGI đỉnh của đỉnh. Pandora đẹp như thơ. Dù cốt truyện hơi đơn giản nhưng trải nghiệm xem tuyệt vời.', 8,  6, 3, FALSE, FALSE, '2026-02-25 20:00:00'),
(43, 19995, 8,  'Avatar làm tôi muốn sống ở Pandora. James Cameron xứng đáng là vua kỹ xảo điện ảnh.', 9,  8, 1, FALSE, FALSE, '2026-03-12 18:00:00'),
(44, 19995, 14, 'Phim đẹp về mặt hình ảnh nhưng nội dung không quá xuất sắc. Xem để thưởng thức kỹ xảo là chính.', 7,  4, 4, FALSE, FALSE, '2026-04-05 10:00:00'),

-- ── 299534 Avengers: Endgame ──────────────────────────────
(45, 299534, 2,  'I am Iron Man — câu nói đi vào lịch sử. Marvel đã tạo ra khoảnh khắc điện ảnh vĩ đại nhất từ trước đến nay.', 10, 8, 0, FALSE, FALSE, '2026-03-01 22:00:00'),
(46, 299534, 6,  'Cảm xúc quá mức sau 11 năm theo dõi MCU. Đây là phần kết hoàn hảo của một kỷ nguyên siêu anh hùng.', 9,  2, 2, FALSE, FALSE, '2026-03-15 20:00:00'),
(47, 299534, 10, 'Avengers Assemble! Cảnh chiến trận cuối phim khiến tôi nổi da gà. Rất xứng đáng 3 giờ đồng hồ ngồi rạp.', 10, 9, 0, FALSE, FALSE, '2026-03-28 21:00:00'),
(48, 299534, 13, 'Tony Stark là nhân vật được xây dựng hoàn hảo nhất MCU. Cái kết của anh ấy thật sự rất ý nghĩa.', 10, 8, 0, FALSE, FALSE, '2026-04-10 19:00:00'),
(78, 299534, 15, 'Cảm ơn Marvel vì 11 năm tuổi thơ tuyệt vời. Endgame là cái kết hoàn hảo không thể có cái kết nào hay hơn.', 10, 9, 0, FALSE, FALSE, '2026-04-24 20:00:00'),

-- ── 315162 Puss in Boots: The Last Wish ──────────────────
(49, 315162, 3,  'Phim hoạt hình hay nhất năm 2022. Death là nhân vật phản diện ấn tượng nhất trong hoạt hình gần đây.', 10, 6, 0, FALSE, FALSE, '2026-03-05 15:00:00'),
(50, 315162, 7,  'Phim nói về việc trân trọng cuộc sống theo cách sâu sắc và đẹp đẽ. Không nghĩ phim hoạt hình lại hay vậy.', 9,  1, 1, FALSE, FALSE, '2026-03-20 16:00:00'),
(51, 315162, 11, 'Wolf Death tạo ra cảm giác sợ hãi thật sự trong phim hoạt hình — điều cực kỳ hiếm gặp.', 9,  7, 0, FALSE, FALSE, '2026-04-02 11:00:00'),
(52, 315162, 15, 'DreamWorks trở lại đỉnh cao với phim này. Animation style đẹp và độc đáo chưa từng thấy trước đó.', 9,  6, 0, FALSE, FALSE, '2026-04-15 14:00:00'),

-- ── 569094 Spider-Man: Across the Spider-Verse ───────────
(53, 569094, 4,  'Phim hoạt hình với art style đẹp nhất từ trước đến nay. Sony đã vượt xa chính họ ở phần 1.', 10, 5, 0, FALSE, FALSE, '2026-03-10 20:00:00'),
(54, 569094, 8,  'Mỗi phiên bản Spider-Man có style riêng biệt và tuyệt vời. Kỹ thuật làm phim đỉnh của đỉnh.', 10, 11, 0, FALSE, FALSE, '2026-03-25 18:00:00'),
(55, 569094, 12, 'Phim hay nhưng cái kết hơi dở dang vì phải chờ phần tiếp theo. Hơi thất vọng về điểm này.', 7,  2, 2, FALSE, FALSE, '2026-04-08 13:00:00'),
(56, 569094, 16, 'Câu chuyện về người trẻ phá vỡ định mệnh rất hay. Miles Morales là Spider-Man tốt nhất từ trước đến nay.', 10, 3, 1, FALSE, FALSE, '2026-04-18 22:00:00'),

-- ── 496243 Parasite ───────────────────────────────────────
(57, 496243, 5,  'Bong Joon-ho đã tạo ra tuyệt phẩm. Phim Hàn đầu tiên giành Oscar Phim Hay Nhất hoàn toàn xứng đáng.', 10, 6, 0, FALSE, FALSE, '2026-03-08 19:00:00'),
(58, 496243, 9,  'Phim phê phán giai cấp xã hội rất khéo léo và tinh tế. Cái kết bất ngờ và ám ảnh rất lâu sau khi xem.', 10, 2, 0, FALSE, FALSE, '2026-03-22 16:00:00'),
(59, 496243, 13, 'Parasite là phim Hàn hay nhất từ trước đến nay theo ý kiến cá nhân tôi. Không có cảnh nào thừa.', 9,  8, 1, FALSE, FALSE, '2026-04-05 15:00:00'),
(60, 496243, 15, 'Phim khiến tôi suy nghĩ rất nhiều về sự bất bình đẳng trong xã hội hiện đại. Rất đáng để xem.', 9,  6, 0, FALSE, FALSE, '2026-04-18 11:00:00'),
(79, 496243, 4,  'Parasite cho thấy phim châu Á không hề thua kém Hollywood. Tự hào cho điện ảnh châu Á.', 10, 10, 0, FALSE, FALSE, '2026-04-25 16:00:00'),

-- ── 129 Spirited Away ─────────────────────────────────────
(61, 129, 3,  'Miyazaki là Thần của hoạt hình. Spirited Away là cuộc hành trình tưởng tượng đẹp nhất từ trước đến nay.', 10, 2, 0, FALSE, FALSE, '2026-03-12 14:00:00'),
(62, 129, 6,  'Mỗi chi tiết trong phim đều có ý nghĩa sâu sắc. Xem đi xem lại vẫn tìm được điều mới thú vị.', 10, 9, 0, FALSE, FALSE, '2026-03-28 17:00:00'),
(63, 129, 10, 'Cô bé Chihiro dũng cảm và đáng yêu vô cùng. Phim dạy trẻ em về lòng dũng cảm theo cách tuyệt vời.', 9,  7, 0, FALSE, FALSE, '2026-04-10 12:00:00'),
(80, 129, 14, 'Spirited Away là phim tôi xem lần đầu hồi nhỏ và ám ảnh đến tận bây giờ vẫn chưa quên được.', 10, 7, 0, FALSE, FALSE, '2026-04-26 11:00:00'),

-- ── 475557 Joker ──────────────────────────────────────────
(64, 475557, 4,  'Joaquin Phoenix deserved his Oscar. Màn trình diễn điên loạn và đau thương cùng lúc — thiên tài thực sự.', 10, 12, 1, FALSE, FALSE, '2026-03-18 21:00:00'),
(65, 475557, 8,  'Phim tâm lý tối tăm nhưng cực kỳ nghệ thuật. Joker không phải phản diện mà là nạn nhân của xã hội.', 9,  8, 2, FALSE, FALSE, '2026-04-02 20:00:00'),
(66, 475557, 14, 'Controversial nhưng phim này thật sự đặt ra câu hỏi về xã hội bỏ rơi người yếu thế. Đáng suy ngẫm.', 8,  5, 3, FALSE, FALSE, '2026-04-15 19:00:00'),

-- ── 10681 WALL-E ──────────────────────────────────────────
(67, 10681, 5,  'WALL-E là bộ phim nói về tình yêu thuần khiết nhất. Không cần nhiều lời thoại vẫn cực kỳ cảm động.', 10, 11, 0, FALSE, FALSE, '2026-03-20 15:00:00'),
(68, 10681, 9,  'Pixar làm được điều không tưởng: khiến người xem yêu một con robot dọn rác. Đây là kỳ tích thật sự.', 10, 8, 0, FALSE, FALSE, '2026-04-05 14:00:00'),
(69, 10681, 15, 'Phim vừa lãng mạn vừa có thông điệp môi trường sâu sắc. Pixar luôn làm tôi bật khóc không kiểm soát.', 9,  6, 0, FALSE, FALSE, '2026-04-20 11:00:00');

-- ════════════════════════════════════════════
-- 5. COMMENTS  (~50 comments, một số toxic để test report)
-- ════════════════════════════════════════════
INSERT INTO comments (id, review_id, user_id, parent_comment_id, content, is_edited, is_hidden, created_at) VALUES
-- Shawshank
(1,  1,  3,  NULL, 'Đồng ý 100%! Andy Dufresne là nhân vật tôi ngưỡng mộ nhất trong lịch sử điện ảnh.', FALSE, FALSE, '2026-01-21 10:00:00'),
(2,  1,  5,  NULL, 'Phim này xứng đáng là số 1 mọi thời đại trên IMDb. Không có gì có thể tranh luận được.', FALSE, FALSE, '2026-01-22 11:30:00'),
(3,  1,  8,  1,    'Bạn nói đúng. Nhân vật Red của Morgan Freeman cũng không kém gì Andy.', FALSE, FALSE, '2026-01-22 14:00:00'),
-- Godfather
(4,  5,  4,  NULL, 'Leave the gun, take the cannoli — câu nói iconic nhất trong lịch sử điện ảnh gangster.', FALSE, FALSE, '2026-01-26 10:00:00'),
(5,  5,  6,  NULL, 'Đây là phim tôi bắt buộc con xem trước khi 18 tuổi. Kinh điển không thể bỏ qua.', FALSE, FALSE, '2026-01-27 15:00:00'),
(6,  5,  9,  4,    'Haha bạn có nhiều câu hay từ phim này không? Tôi cũng nghĩ vậy.', FALSE, FALSE, '2026-01-28 09:00:00'),
-- Inception
(7,  24, 3,  NULL, 'Cái con quay cuối phim có dừng lại không? Câu hỏi tôi tranh luận với bạn bè mãi không xong.', FALSE, FALSE, '2026-02-11 10:00:00'),
(8,  24, 5,  NULL, 'Con quay là wedding ring của Cobb, không phải totem thật. Totem thực của anh ấy là chiếc nhẫn.', FALSE, FALSE, '2026-02-12 11:00:00'),
(9,  24, 7,  7,    'Wow tôi chưa nghĩ đến điều đó. Phải xem lại phim ngay bây giờ!', FALSE, FALSE, '2026-02-13 09:30:00'),
(10, 24, 10, 8,    'Lý thuyết hay đấy nhưng Nolan chưa bao giờ xác nhận hay phủ nhận điều này.', FALSE, FALSE, '2026-02-14 16:00:00'),
-- Dark Knight
(11, 31, 6,  NULL, 'Heath Ledger là thiên tài thật sự. Anh ấy mãi mãi là Joker tốt nhất không ai thay thế được.', FALSE, FALSE, '2026-01-23 10:00:00'),
(12, 31, 2,  NULL, 'Cả dàn cast phim này đều diễn xuất thần. Không có vai nào yếu hay thừa.', FALSE, FALSE, '2026-01-24 14:00:00'),
(13, 31, 9,  11,   'Thật buồn khi anh ấy ra đi trước khi phim chiếu. Hẳn anh biết mình đã tạo ra huyền thoại.', FALSE, FALSE, '2026-01-25 10:00:00'),
-- Endgame
(14, 45, 5,  NULL, 'Tôi đã khóc 3 lần trong rạp. Lần 1 khi Tony snap, lần 2 mọi người quay lại, lần 3 cuối phim.', FALSE, FALSE, '2026-03-02 10:00:00'),
(15, 45, 8,  NULL, 'A-Force scene là highlight của phim. Tất cả nữ hero cùng xuất hiện — tuyệt đỉnh không thể tả.', FALSE, FALSE, '2026-03-03 15:00:00'),
(16, 45, 10, 14,   'Tôi cũng vậy bạn ơi. Cúi đầu tưởng nhớ Iron Man mãi mãi.', FALSE, FALSE, '2026-03-04 09:00:00'),
-- Puss in Boots
(17, 49, 7,  NULL, 'Death trong phim này ám ảnh tôi hơn nhiều villain thật sự trong phim người thật.', FALSE, FALSE, '2026-03-06 11:00:00'),
(18, 49, 11, NULL, 'Phần về fear và lòng dũng cảm được thể hiện rất đẹp. Không nghĩ phim hoạt hình lại sâu vậy.', FALSE, FALSE, '2026-03-07 16:00:00'),
(19, 49, 15, 17,   'Con sói đó tạo ra cảm giác chết chóc rất đáng sợ theo nghĩa bóng — thiên tài sáng tạo nhân vật.', FALSE, FALSE, '2026-03-08 10:00:00'),
-- Parasite
(20, 57, 9,  NULL, 'Cái mùi trong phim đóng vai trò quan trọng hơn người xem nghĩ. Chi tiết tinh tế của Bong Joon-ho.', FALSE, FALSE, '2026-03-09 10:00:00'),
(21, 57, 13, NULL, 'Xem phim xong mới hiểu tại sao Bong Joon-ho gọi nó là "without-genre film".', FALSE, FALSE, '2026-03-10 14:00:00'),
(22, 57, 15, 20,   'Đúng rồi! Cái hầm bí mật là hình tượng hoàn hảo cho tầng lớp thấp trong xã hội bất bình đẳng.', FALSE, FALSE, '2026-03-11 09:00:00'),
-- Your Name
(23, 38, 7,  NULL, 'Sparks với RADWIMPS — combo hoàn hảo. Nhạc phim hay không kém gì phần hình ảnh tuyệt đẹp.', FALSE, FALSE, '2026-02-21 11:00:00'),
(24, 38, 15, NULL, 'Lần đầu xem tôi không hiểu tại sao họ không nhớ nhau. Xem lần 2 mới "ồ" ra toàn bộ.', FALSE, FALSE, '2026-02-22 15:00:00'),
(25, 38, 11, 23,   'Nhạc phim RADWIMPS mình cũng đang nghe repeat. Zenzen Zense hay quá không bỏ được.', FALSE, FALSE, '2026-02-23 10:00:00'),
-- Spirited Away
(26, 61, 2,  NULL, 'Câu chuyện ẩn dụ về bản sắc và sự lớn lên của một đứa trẻ. Miyazaki quá thiên tài.', FALSE, FALSE, '2026-03-13 10:00:00'),
(27, 61, 10, NULL, 'Cách thế giới tâm linh được xây dựng trong phim này phong phú hơn bất kỳ phim nào tôi từng xem.', FALSE, FALSE, '2026-03-14 15:00:00'),
(28, 61, 5,  26,   'Đúng rồi! Yubaba và Zeniba là hai mặt của một đồng xu — thiện và ác trong cùng một con người.', FALSE, FALSE, '2026-03-15 09:00:00'),
-- WALL-E
(29, 67, 9,  NULL, 'WALL-E và EVE có chuyện tình đẹp hơn nhiều bộ phim tình cảm người thật tôi từng xem.', FALSE, FALSE, '2026-03-21 10:00:00'),
(30, 67, 13, NULL, 'Thông điệp về môi trường của phim ngày càng relevant theo từng năm qua. Pixar nhìn xa trông rộng.', FALSE, FALSE, '2026-03-22 14:00:00'),
-- Spider-Verse
(31, 53, 8,  NULL, 'Không có phim hoạt hình nào dám thử nghiệm táo bạo như phim này về mặt visual và narrative.', FALSE, FALSE, '2026-03-11 11:00:00'),
(32, 53, 14, NULL, 'Cách mỗi universe có style riêng — Lego Miles, Gwen watercolor — sáng tạo thiên tài thực sự.', FALSE, FALSE, '2026-03-12 16:00:00'),
(33, 53, 2,  31,   'Spider-Punk universe với style punk rock đặc biệt ấn tượng nhất với tôi.', FALSE, FALSE, '2026-03-13 09:00:00'),
-- Joker
(34, 64, 6,  NULL, 'Cái cười của Joker nghe vừa đau đớn vừa man rợ. Joaquin Phoenix làm tôi không thoải mái suốt phim.', FALSE, FALSE, '2026-03-19 10:00:00'),
(35, 64, 12, NULL, 'Phim bị nhiều người chỉ trích vì glorify violence nhưng thực ra nó đang phê phán xã hội sâu sắc.', FALSE, FALSE, '2026-03-20 14:00:00'),
(36, 64, 14, 35,   'Tôi nghĩ người xem cần đủ trưởng thành để phân biệt. Phim không hề glorify gì cả.', FALSE, FALSE, '2026-03-21 09:00:00'),
-- ── Comments có nội dung vi phạm (để test chức năng report) ──
(37, 16, 12, NULL, 'Review ngu vãi, phim hay thế mà chấm 7/10? Không biết gì về phim thì đừng review.', FALSE, FALSE, '2026-03-09 17:00:00'),
(38, 44, 12, NULL, 'Ai thích phim này chắc IQ thấp lắm, cốt truyện con nít mà cũng khen.', FALSE, FALSE, '2026-04-06 11:00:00'),
(39, 55, 16, NULL, 'SPOILER ALERT (không cảnh báo): Phần 3 kết thúc theo kiểu Miles sẽ phải hy sinh toàn bộ...', FALSE, FALSE, '2026-04-09 15:00:00'),
(40, 33, 16, NULL, 'Chỉ dân thiếu học mới thích phim Batman. Hãy xem phim art house đi cho mở mang đầu óc.', FALSE, FALSE, '2026-02-26 10:00:00'),
-- Thêm comments lành mạnh
(41, 17, 4,  NULL, 'Run Forrest Run! Câu nói iconic nhất lịch sử điện ảnh không thể tranh cãi.', FALSE, FALSE, '2026-01-31 10:00:00'),
(42, 17, 6,  NULL, 'Tom Hanks xứng đáng nhận 2 Oscar cho vai này. Diễn xuất tự nhiên đến không tin được.', FALSE, FALSE, '2026-02-01 14:00:00'),
(43, 28, 5,  NULL, 'Hans Zimmer viết nhạc phim hay nhất sự nghiệp ông ấy cho Interstellar. Bất hủ.', FALSE, FALSE, '2026-02-15 10:00:00'),
(44, 28, 10, NULL, 'Cảnh Cooper trong không gian 5 chiều là cảnh phim kỳ diệu nhất tôi từng được chứng kiến.', FALSE, FALSE, '2026-02-16 15:00:00'),
(45, 35, 6,  NULL, 'Neo là The One nhưng thực ra mọi người đều có thể là Neo. Đó là thông điệp của phim.', FALSE, FALSE, '2026-02-19 10:00:00'),
(46, 21, 3,  NULL, 'The twist ở cuối phim này khiến tôi phải xem lại từ đầu ngay lập tức không thể chờ được.', FALSE, FALSE, '2026-02-06 11:00:00'),
(47, 11, 6,  NULL, 'Spielberg thể hiện sự kinh dị của Holocaust mà không cần cường điệu hóa bạo lực. Tài tình.', FALSE, FALSE, '2026-02-06 16:00:00'),
(48, 14, 8,  NULL, 'Mia Wallace là nhân vật nữ cool nhất trong lịch sử điện ảnh. Uma Thurman xuất sắc.', FALSE, FALSE, '2026-01-29 10:00:00'),
(49, 9,  4,  NULL, 'Young Vito Corleone của De Niro hay đến mức phim này xứng đáng đứng độc lập không cần phần 1.', FALSE, FALSE, '2026-02-02 15:00:00'),
(50, 22, 5,  NULL, 'Fight Club nói về sự trống rỗng của xã hội tiêu thụ — ngày nay càng relevant hơn bao giờ hết.', FALSE, FALSE, '2026-03-01 10:00:00');

-- ════════════════════════════════════════════
-- 6. REVIEW_LIKES  (~80 reactions)
-- ════════════════════════════════════════════
INSERT INTO review_likes (id, review_id, user_id, type, created_at) VALUES
-- Shawshank reviews
(1,  1,  3,  'LIKE', '2026-01-21 10:00:00'), (2,  1,  4,  'LIKE', '2026-01-22 11:00:00'),
(3,  1,  5,  'LIKE', '2026-01-23 12:00:00'), (4,  1,  6,  'LIKE', '2026-01-24 13:00:00'),
(5,  1,  8,  'LIKE', '2026-01-25 14:00:00'), (6,  1,  9,  'LIKE', '2026-01-26 15:00:00'),
(7,  1,  10, 'LIKE', '2026-01-27 16:00:00'),
(8,  2,  4,  'LIKE', '2026-01-23 10:00:00'), (9,  2,  6,  'LIKE', '2026-01-24 11:00:00'),
(10, 2,  9,  'LIKE', '2026-01-25 12:00:00'),
(11, 3,  2,  'LIKE', '2026-02-02 10:00:00'), (12, 3,  6,  'LIKE', '2026-02-03 11:00:00'),
-- Godfather
(13, 5,  3,  'LIKE', '2026-01-26 10:00:00'), (14, 5,  4,  'LIKE', '2026-01-27 11:00:00'),
(15, 5,  6,  'LIKE', '2026-01-28 12:00:00'), (16, 5,  7,  'LIKE', '2026-01-29 13:00:00'),
(17, 5,  8,  'LIKE', '2026-01-30 14:00:00'),
(18, 6,  2,  'LIKE', '2026-02-03 10:00:00'), (19, 6,  5,  'LIKE', '2026-02-04 11:00:00'),
(20, 7,  3,  'LIKE', '2026-02-11 10:00:00'),
-- Dark Knight
(21, 31, 2,  'LIKE', '2026-01-23 10:00:00'), (22, 31, 3,  'LIKE', '2026-01-24 11:00:00'),
(23, 31, 5,  'LIKE', '2026-01-25 12:00:00'), (24, 31, 6,  'LIKE', '2026-01-26 13:00:00'),
(25, 31, 7,  'LIKE', '2026-01-27 14:00:00'), (26, 31, 9,  'LIKE', '2026-01-28 15:00:00'),
(27, 31, 10, 'LIKE', '2026-01-29 16:00:00'),
(28, 32, 3,  'LIKE', '2026-02-09 10:00:00'), (29, 32, 5,  'LIKE', '2026-02-10 11:00:00'),
(30, 33, 9,  'LIKE', '2026-02-26 10:00:00'), (31, 33, 4,  'DISLIKE', '2026-02-27 10:00:00'),
-- Inception
(32, 24, 3,  'LIKE', '2026-02-11 10:00:00'), (33, 24, 4,  'LIKE', '2026-02-12 11:00:00'),
(34, 24, 5,  'LIKE', '2026-02-13 12:00:00'), (35, 24, 6,  'LIKE', '2026-02-14 13:00:00'),
(36, 24, 7,  'LIKE', '2026-02-15 14:00:00'), (37, 24, 8,  'LIKE', '2026-02-16 15:00:00'),
(38, 25, 3,  'LIKE', '2026-02-21 10:00:00'), (39, 25, 6,  'LIKE', '2026-02-22 11:00:00'),
(40, 25, 9,  'DISLIKE', '2026-02-23 12:00:00'),
-- Endgame
(41, 45, 3,  'LIKE', '2026-03-02 10:00:00'), (42, 45, 4,  'LIKE', '2026-03-03 11:00:00'),
(43, 45, 5,  'LIKE', '2026-03-04 12:00:00'), (44, 45, 6,  'LIKE', '2026-03-05 13:00:00'),
(45, 45, 7,  'LIKE', '2026-03-06 14:00:00'), (46, 45, 8,  'LIKE', '2026-03-07 15:00:00'),
(47, 45, 9,  'LIKE', '2026-03-08 16:00:00'), (48, 45, 13, 'LIKE', '2026-03-09 17:00:00'),
(49, 46, 2,  'LIKE', '2026-03-16 10:00:00'), (50, 46, 8,  'LIKE', '2026-03-17 11:00:00'),
-- Parasite
(51, 57, 3,  'LIKE', '2026-03-09 10:00:00'), (52, 57, 4,  'LIKE', '2026-03-10 11:00:00'),
(53, 57, 6,  'LIKE', '2026-03-11 12:00:00'), (54, 57, 8,  'LIKE', '2026-03-12 13:00:00'),
(55, 57, 9,  'LIKE', '2026-03-13 14:00:00'), (56, 57, 13, 'LIKE', '2026-03-14 15:00:00'),
(57, 58, 5,  'LIKE', '2026-03-23 10:00:00'), (58, 58, 6,  'LIKE', '2026-03-24 11:00:00'),
-- Puss in Boots
(59, 49, 4,  'LIKE', '2026-03-06 10:00:00'), (60, 49, 5,  'LIKE', '2026-03-07 11:00:00'),
(61, 49, 7,  'LIKE', '2026-03-08 12:00:00'), (62, 49, 8,  'LIKE', '2026-03-09 13:00:00'),
(63, 49, 11, 'LIKE', '2026-03-10 14:00:00'), (64, 49, 15, 'LIKE', '2026-03-11 15:00:00'),
(65, 50, 3,  'LIKE', '2026-03-21 10:00:00'),
-- Spider-Verse
(66, 53, 5,  'LIKE', '2026-03-11 10:00:00'), (67, 53, 6,  'LIKE', '2026-03-12 11:00:00'),
(68, 53, 7,  'LIKE', '2026-03-13 12:00:00'), (69, 53, 9,  'LIKE', '2026-03-14 13:00:00'),
(70, 53, 14, 'LIKE', '2026-03-15 14:00:00'),
(71, 55, 3,  'DISLIKE', '2026-04-09 10:00:00'), (72, 55, 9, 'DISLIKE', '2026-04-10 11:00:00'),
-- Your Name
(73, 38, 4,  'LIKE', '2026-02-21 10:00:00'), (74, 38, 6,  'LIKE', '2026-02-22 11:00:00'),
(75, 38, 8,  'LIKE', '2026-02-23 12:00:00'), (76, 38, 11, 'LIKE', '2026-02-24 13:00:00'),
(77, 38, 15, 'LIKE', '2026-02-25 14:00:00'),
(78, 39, 3,  'LIKE', '2026-03-09 10:00:00'),
-- Spirited Away
(79, 61, 4,  'LIKE', '2026-03-13 10:00:00'), (80, 61, 5,  'LIKE', '2026-03-14 11:00:00');

-- ════════════════════════════════════════════
-- 7. REPORTS  (mix PENDING / RESOLVED / IGNORED)
-- ════════════════════════════════════════════
INSERT INTO reports (id, reporter_id, target_id, target_type, type, description, status, resolution, created_at) VALUES
-- Reports trên comments vi phạm
(1,  5,  37, 'COMMENT', 'HATE_SPEECH',    'Comment dùng ngôn ngữ xúc phạm và không tôn trọng người đánh giá phim.', 'RESOLVED', 'Đã cảnh cáo người dùng và ẩn comment vi phạm.',            '2026-03-10 09:00:00'),
(2,  3,  37, 'COMMENT', 'INAPPROPRIATE',  'Comment thô tục và thiếu văn minh trong thảo luận.', 'RESOLVED', 'Đã xử lý theo báo cáo #1.',                               '2026-03-10 12:00:00'),
(3,  6,  38, 'COMMENT', 'HATE_SPEECH',    'Bình luận xúc phạm người dùng khác dựa trên sở thích cá nhân.', 'RESOLVED', 'Tài khoản đã bị cảnh cáo do vi phạm nhiều lần.',         '2026-04-07 10:00:00'),
(4,  9,  39, 'COMMENT', 'SPOILER',        'Comment chứa spoiler nặng cho Spider-Man 3 mà không có cảnh báo.',        'PENDING',   NULL,                                                    '2026-04-10 09:00:00'),
(5,  13, 39, 'COMMENT', 'SPOILER',        'Spoiler toàn bộ nội dung phim chưa ra mắt, không có cảnh báo rõ ràng.',   'PENDING',   NULL,                                                    '2026-04-10 14:00:00'),
(6,  4,  40, 'COMMENT', 'HATE_SPEECH',    'Bình luận khinh thường người dùng khác dựa trên sở thích điện ảnh.',      'RESOLVED', 'Đã cảnh cáo tài khoản vi phạm.',                         '2026-02-27 09:00:00'),
(17, 2,  37, 'COMMENT', 'INAPPROPRIATE',  'Bình luận tấn công cá nhân người viết review.',                            'RESOLVED', 'Đã xử lý theo báo cáo #1.',                               '2026-03-11 09:00:00'),
(18, 5,  40, 'COMMENT', 'HATE_SPEECH',    'Khinh thường người xem có sở thích điện ảnh khác.',                        'RESOLVED', 'Đã cảnh cáo tài khoản vi phạm.',                         '2026-02-27 15:00:00'),
-- Reports trên reviews
(7,  8,  16, 'REVIEW',  'INAPPROPRIATE',  'Review dùng ngôn ngữ không phù hợp để mô tả phim.',                       'IGNORED',  'Sau khi xem xét, review không vi phạm tiêu chuẩn cộng đồng.','2026-03-09 10:00:00'),
(8,  5,  33, 'REVIEW',  'SPAM',           'Review có vẻ chỉ viết để gây chú ý chứ không thực sự về nội dung phim.',  'IGNORED',  'Review có nội dung hợp lệ, không phải spam.',              '2026-02-26 11:00:00'),
(9,  3,  55, 'REVIEW',  'SPOILER',        'Review tiết lộ ending mà không có cảnh báo spoiler.',                      'PENDING',   NULL,                                                    '2026-04-09 09:00:00'),
(10, 7,  44, 'REVIEW',  'INAPPROPRIATE',  'Review dùng ngôn ngữ thiếu văn minh để phê bình phim.',                   'PENDING',   NULL,                                                    '2026-04-06 10:00:00'),
(11, 2,  66, 'REVIEW',  'INAPPROPRIATE',  'Ngôn ngữ trong review không phù hợp với cộng đồng.',                      'PENDING',   NULL,                                                    '2026-04-16 09:00:00'),
(12, 9,  56, 'REVIEW',  'SPAM',           'Review này có vẻ copy paste từ nơi khác, không phải ý kiến cá nhân.',     'PENDING',   NULL,                                                    '2026-04-19 10:00:00'),
(13, 6,  35, 'REVIEW',  'INAPPROPRIATE',  'Review chỉ có 1 câu, không đủ nội dung.',                                  'IGNORED',  'Không có quy định về độ dài tối thiểu của review.',       '2026-02-19 09:00:00'),
(14, 4,  74, 'REVIEW',  'HATE_SPEECH',    'Review phê phán theo hướng kỳ thị nhóm người xem nhất định.',              'PENDING',   NULL,                                                    '2026-04-17 10:00:00'),
(15, 10, 71, 'REVIEW',  'SPAM',           'Review lặp lại nội dung review khác của cùng người dùng này.',             'PENDING',   NULL,                                                    '2026-04-09 11:00:00'),
(16, 14, 65, 'REVIEW',  'OTHER',          'Review có thông tin sai về thời điểm phim được phát hành.',                'IGNORED',  'Đây là ý kiến cá nhân, không phải thông tin sai lệch.',   '2026-04-03 14:00:00');

-- ════════════════════════════════════════════
-- 8. PLAYLISTS  (3 hệ thống/user + custom)
-- ════════════════════════════════════════════
INSERT INTO playlist (id, name, user_id) VALUES
-- User 2 Minh
(1,  'My Watchlist',              2), (2,  'Recently Viewed',            2), (3,  'Watch Later',                2),
(4,  'Phim kinh điển phải xem',   2),
-- User 3 Hương
(5,  'My Watchlist',              3), (6,  'Recently Viewed',            3), (7,  'Watch Later',                3),
(8,  'Anime yêu thích',           3),
-- User 4 Tuấn
(9,  'My Watchlist',              4), (10, 'Recently Viewed',            4), (11, 'Watch Later',                4),
(12, 'Top phim mọi thời đại',     4),
-- User 5 Linh
(13, 'My Watchlist',              5), (14, 'Recently Viewed',            5), (15, 'Watch Later',                5),
(16, 'Phim khoa học viễn tưởng',  5),
-- User 6 Dũng
(17, 'My Watchlist',              6), (18, 'Recently Viewed',            6), (19, 'Watch Later',                6),
-- User 7 Thảo
(20, 'My Watchlist',              7), (21, 'Recently Viewed',            7), (22, 'Watch Later',                7),
(23, 'Phim buồn xem khi ở nhà',   7),
-- User 8 Nam
(24, 'My Watchlist',              8), (25, 'Recently Viewed',            8), (26, 'Watch Later',                8),
(27, 'Marvel Universe',           8),
-- User 9 Mai
(28, 'My Watchlist',              9), (29, 'Recently Viewed',            9), (30, 'Watch Later',                9),
(31, 'Phim tâm lý hay',           9),
-- User 10 Khoa
(32, 'My Watchlist',              10), (33, 'Recently Viewed',           10), (34, 'Watch Later',               10),
-- User 11 Phương
(35, 'My Watchlist',              11), (36, 'Recently Viewed',           11), (37, 'Watch Later',               11),
-- User 13 Quỳnh
(38, 'My Watchlist',              13), (39, 'Recently Viewed',           13), (40, 'Watch Later',               13),
(41, 'Phim hoạt hình đỉnh',       13),
-- User 14 Bảo
(42, 'My Watchlist',              14), (43, 'Recently Viewed',           14), (44, 'Watch Later',               14),
-- User 15 Yến
(45, 'My Watchlist',              15), (46, 'Recently Viewed',           15), (47, 'Watch Later',               15),
(48, 'Phim Hàn Quốc hay',         15),
-- User 16 Thịnh
(49, 'My Watchlist',              16), (50, 'Recently Viewed',           16), (51, 'Watch Later',               16),
(52, 'Phim tôi muốn xem lại',     16);

-- ════════════════════════════════════════════
-- 9. PLAYLIST_MOVIES
-- ════════════════════════════════════════════
INSERT INTO playlist_movie (id, playlist_id, movie_id) VALUES
-- User 2 — My Watchlist
(1,  1,  278),(2,  1,  238),(3,  1,  240),(4,  1,  424),(5,  1,  680),
-- User 2 — Recently Viewed
(6,  2,  27205),(7,  2,  155),(8,  2,  372058),(9,  2,  299534),
-- User 2 — Watch Later
(10, 3,  157336),(11, 3,  603),(12, 3,  496243),
-- User 2 — Custom
(13, 4,  278),(14, 4,  238),(15, 4,  13),(16, 4,  424),(17, 4,  680),(18, 4,  550),
-- User 3 — My Watchlist
(19, 5,  372058),(20, 5,  129),(21, 5,  315162),(22, 5,  10681),
-- User 3 — Recently Viewed
(23, 6,  278),(24, 6,  238),(25, 6,  27205),
-- User 3 — Watch Later
(26, 7,  496243),(27, 7,  475557),
-- User 3 — Custom Anime
(28, 8,  372058),(29, 8,  129),
-- User 4 — My Watchlist
(30, 9,  155),(31, 9,  680),(32, 9,  550),(33, 9,  475557),
-- User 4 — Recently Viewed
(34, 10, 238),(35, 10, 424),(36, 10, 13),
-- User 4 — Watch Later
(37, 11, 278),(38, 11, 299534),(39, 11, 569094),
-- User 4 — Custom Top All Time
(40, 12, 278),(41, 12, 238),(42, 12, 155),(43, 12, 27205),(44, 12, 680),(45, 12, 424),(46, 12, 13),
-- User 5 — My Watchlist
(47, 13, 27205),(48, 13, 157336),(49, 13, 603),(50, 13, 19995),
-- User 5 — Recently Viewed
(51, 14, 278),(52, 14, 496243),(53, 14, 10681),
-- User 5 — Watch Later
(54, 15, 315162),(55, 15, 569094),(56, 15, 372058),
-- User 5 — Custom SciFi
(57, 16, 27205),(58, 16, 157336),(59, 16, 603),(60, 16, 19995),
-- User 6 — My Watchlist
(61, 17, 238),(62, 17, 240),(63, 17, 13),(64, 17, 129),(65, 17, 496243),
-- User 6 — Recently Viewed
(66, 18, 278),(67, 18, 155),(68, 18, 372058),
-- User 6 — Watch Later
(69, 19, 27205),(70, 19, 315162),
-- User 7 — My Watchlist
(71, 20, 372058),(72, 20, 13),(73, 20, 315162),
-- User 7 — Recently Viewed
(74, 21, 278),(75, 21, 27205),(76, 21, 155),
-- User 7 — Watch Later
(77, 22, 496243),(78, 22, 129),(79, 22, 10681),
-- User 7 — Custom Sad Movies
(80, 23, 13),(81, 23, 278),(82, 23, 372058),
-- User 8 — My Watchlist
(83, 24, 299534),(84, 24, 155),(85, 24, 19995),
-- User 8 — Recently Viewed
(86, 25, 278),(87, 25, 238),(88, 25, 27205),
-- User 8 — Watch Later
(89, 26, 569094),(90, 26, 315162),(91, 26, 496243),
-- User 8 — Custom Marvel
(92, 27, 299534),(93, 27, 155),
-- User 9 — My Watchlist
(94, 28, 496243),(95, 28, 475557),(96, 28, 550),
-- User 9 — Recently Viewed
(97, 29, 278),(98, 29, 238),(99, 29, 10681),
-- User 9 — Watch Later
(100,30, 372058),(101,30, 129),(102,30, 315162),
-- User 9 — Custom Psychology
(103,31, 496243),(104,31, 475557),(105,31, 550),(106,31, 680),
-- User 10 — My Watchlist
(107,32, 278),(108,32, 27205),(109,32, 157336),
-- User 10 — Recently Viewed
(110,33, 299534),(111,33, 496243),
-- User 10 — Watch Later
(112,34, 315162),(113,34, 569094),
-- User 11 — My Watchlist
(114,35, 372058),(115,35, 315162),(116,35, 10681),
-- User 11 — Recently Viewed
(117,36, 27205),(118,36, 155),
-- User 11 — Watch Later
(119,37, 496243),(120,37, 129),
-- User 13 — My Watchlist
(121,38, 299534),(122,38, 569094),(123,38, 315162),(124,38, 10681),
-- User 13 — Recently Viewed
(125,39, 278),(126,39, 496243),(127,39, 372058),
-- User 13 — Watch Later
(128,40, 475557),(129,40, 680),
-- User 13 — Custom Animation
(130,41, 315162),(131,41, 569094),(132,41, 10681),(133,41, 129),(134,41, 372058),
-- User 14 — My Watchlist
(135,42, 278),(136,42, 238),(137,42, 155),
-- User 14 — Recently Viewed
(138,43, 27205),(139,43, 496243),
-- User 14 — Watch Later
(140,44, 372058),(141,44, 129),(142,44, 315162),
-- User 15 — My Watchlist
(143,45, 496243),(144,45, 372058),(145,45, 129),
-- User 15 — Recently Viewed
(146,46, 299534),(147,46, 315162),(148,46, 569094),
-- User 15 — Watch Later
(149,47, 278),(150,47, 238),(151,47, 155),
-- User 15 — Custom Korean
(152,48, 496243),
-- User 16 — My Watchlist
(153,49, 569094),(154,49, 496243),
-- User 16 — Recently Viewed
(155,50, 155),(156,50, 27205),
-- User 16 — Watch Later
(157,51, 278),(158,51, 372058),
-- User 16 — Custom Rewatch
(159,52, 155),(160,52, 27205),(161,52, 299534);

SET FOREIGN_KEY_CHECKS = 1;

-- ════════════════════════════════════════════
-- TỔNG KẾT DỮ LIỆU
-- ════════════════════════════════════════════
-- Users    : 16 (1 admin + 15 thành viên)
--            ACTIVE: 12 | WARNING: 2 | BANNED: 2
--            LOCAL: 13  | GOOGLE: 2
-- Reviews  : 80 (trải đều 20 phim TMDB, rating 7–10)
-- Comments : 50 (có 4 comment vi phạm để test report)
-- Likes    : 80 (74 LIKE + 6 DISLIKE)
-- Reports  : 18 (PENDING: 8 | RESOLVED: 7 | IGNORED: 3)
-- Playlists: 52 (39 hệ thống + 13 custom)
-- PM items : 161 entries
-- ════════════════════════════════════════════
