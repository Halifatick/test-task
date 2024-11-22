-- Создание базы данных
CREATE DATABASE container_database;
GO

-- Использование новой базы данных
USE container_database;
GO

-- Создание таблицы containers
CREATE TABLE containers (
                            container_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(), -- Идентификатор контейнера
                            container_number INT NOT NULL,                             -- Номер контейнера
                            container_type NVARCHAR(50) NOT NULL,                      -- Тип контейнера
                            container_length FLOAT NOT NULL,                           -- Длина контейнера
                            container_width FLOAT NOT NULL,                            -- Ширина контейнера
                            container_height FLOAT NOT NULL,                           -- Высота контейнера
                            container_weight FLOAT NOT NULL,                           -- Вес контейнера
                            is_empty BIT NOT NULL,                                     -- Пустой или не пустой
                            date_received DATETIME NOT NULL                            -- Дата поступления
);

-- Создание таблицы operations
CREATE TABLE operations (
                            operation_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(), -- Идентификатор операции
                            container_id UNIQUEIDENTIFIER NOT NULL,                    -- Внешний ключ на контейнер
                            operation_start DATETIME NOT NULL,                         -- Дата начала операции
                            operation_end DATETIME NOT NULL,                           -- Дата окончания операции
                            operation_type NVARCHAR(50) NOT NULL,                      -- Тип операции
                            operator_name NVARCHAR(100) NOT NULL,                      -- Имя оператора
                            inspection_location NVARCHAR(100) NOT NULL,                -- Место инспекции
                            CONSTRAINT fk_operations_containers FOREIGN KEY (container_id) REFERENCES containers(container_id) -- Связь с таблицей containers
);
GO

-- Вставка данных в таблицу containers
INSERT INTO containers (container_number, container_type, container_length, container_width, container_height, container_weight, is_empty, date_received)
VALUES
(1001, 'large', 10.5, 5.5, 8.2, 200.0, 0, '2024-11-20T10:00:00'),
(1002, 'medium', 8.0, 4.5, 6.0, 150.0, 1, '2024-11-21T12:00:00');

-- Вставка данных в таблицу operations
INSERT INTO operations (container_id, operation_start, operation_end, operation_type, operator_name, inspection_location)
VALUES
    ((SELECT container_id FROM containers WHERE container_number = 1001), '2024-11-20T11:00:00', '2024-11-20T15:00:00', 'load', 'John Doe', 'warehouse_a'),
    ((SELECT container_id FROM containers WHERE container_number = 1001), '2024-11-21T09:00:00', '2024-11-21T13:00:00', 'inspection', 'Jane Smith', 'dock_b'),
    ((SELECT container_id FROM containers WHERE container_number = 1002), '2024-11-21T14:00:00', '2024-11-21T18:00:00', 'unload', 'Mike Johnson', 'dock_c');
GO

-- b. Напишите запрос, выбирающий из первой таблицы все данные по контейнерам в формате JSON не используя встроенную функцию
SELECT
    '{' +
    '"container_id": "' + CAST(container_id AS NVARCHAR(MAX)) + '", ' +
    '"container_number": ' + CAST(container_number AS NVARCHAR(MAX)) + ', ' +
    '"container_type": "' + container_type + '", ' +
    '"container_length": ' + CAST(container_length AS NVARCHAR(MAX)) + ', ' +
    '"container_width": ' + CAST(container_width AS NVARCHAR(MAX)) + ', ' +
    '"container_height": ' + CAST(container_height AS NVARCHAR(MAX)) + ', ' +
    '"container_weight": ' + CAST(container_weight AS NVARCHAR(MAX)) + ', ' +
    '"is_empty": ' + CAST(is_empty AS NVARCHAR(MAX)) + ', ' +
    '"date_received": "' + CONVERT(NVARCHAR(MAX), date_received, 127) + '"' +
    '}' AS json
FROM containers;

-- c. Напишите запрос, выбирающий из второй таблицы все данные по операциям для определенного контейнера в формате JSON не используя встроенную функцию
DECLARE @container_id UNIQUEIDENTIFIER;
SET @container_id = (SELECT container_id FROM containers WHERE container_number = 1001); -- Идентификатор контейнера

SELECT
    '{' +
    '"operation_id": "' + CAST(operation_id AS NVARCHAR(MAX)) + '", ' +
    '"container_id": "' + CAST(container_id AS NVARCHAR(MAX)) + '", ' +
    '"operation_start": "' + CONVERT(NVARCHAR(MAX), operation_start, 127) + '", ' +
    '"operation_end": "' + CONVERT(NVARCHAR(MAX), operation_end, 127) + '", ' +
    '"operation_type": "' + operation_type + '", ' +
    '"operator_name": "' + operator_name + '", ' +
    '"inspection_location": "' + inspection_location + '"' +
    '}' AS json
FROM operations
WHERE container_id = @container_id;