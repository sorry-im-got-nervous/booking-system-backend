--
-- Структура таблицы `users`
--

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM('user', 'admin')
        DEFAULT 'user',

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------


--
-- Структура таблицы `resources`
--

CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    type ENUM(
        'room',
        'equipment',
        'employee',
        'vehicle',
        'other'
    ) NOT NULL,

    responsible_user_id INT,

    status ENUM('active', 'inactive')
        DEFAULT 'active',

    INDEX (responsible_user_id),

    FOREIGN KEY (responsible_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- --------------------------------------------------------



--
-- Структура таблицы `bookings`
--

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    resource_id INT NOT NULL,

    user_id INT NOT NULL,

    start_time DATETIME NOT NULL,

    end_time DATETIME NOT NULL,

    purpose VARCHAR(255),

    status ENUM('active', 'cancelled')
        DEFAULT 'active',

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    INDEX (resource_id),
    INDEX (user_id),

    FOREIGN KEY (resource_id)
        REFERENCES resources(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- --------------------------------------------------------



--
-- Структура таблицы `notifications`
--

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(255),

    message TEXT,

    is_read BOOLEAN
        DEFAULT FALSE,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    INDEX (user_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);