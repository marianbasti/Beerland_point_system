-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2019 at 02:59 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db`
--

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `documento` int(11) NOT NULL,
  `nacimiento` date NOT NULL,
  `localidad` char(255) NOT NULL,
  `sexo` set('m','f','o') NOT NULL,
  `tarjeta` char(35) NOT NULL,
  `puntos` int(11) NOT NULL,
  `id_app` int(11) DEFAULT NULL,
  `rubia` int(11) NOT NULL,
  `negra` int(11) NOT NULL,
  `roja` int(11) NOT NULL,
  `temporada` int(11) NOT NULL,
  `otroalcohol` int(11) NOT NULL,
  `salcohol` int(11) NOT NULL,
  `comida` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`id`, `documento`, `nacimiento`, `localidad`, `sexo`, `tarjeta`, `puntos`, `id_app`, `rubia`, `negra`, `roja`, `temporada`, `otroalcohol`, `salcohol`, `comida`) VALUES
(3, 39584399, '1996-05-06', 'Temperley', 'm', '123456789', 4730, NULL, 9, 10, 33, 2, 0, 14, 22),
(8, 39584395, '2007-06-13', 'Venado Tuerto', 'f', '123456785', 0, NULL, 0, 0, 0, 0, 0, 0, 0),
(10, 395848484, '1999-02-03', 'Temperley', 'm', '987654321', 31285, NULL, 10, 139, 9, 12, 0, 0, 58),
(12, 395888643, '2019-07-30', 'El Cóndor', 'f', 'ñ6061268028901086¡200210100000_', 7240, NULL, 2, 17, 6, 0, 0, 18, 31);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
