CREATE DATABASE  IF NOT EXISTS `bear_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `bear_db`;
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bear_db
-- ------------------------------------------------------
-- Server version	5.7.11-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `master_recipe`
--

DROP TABLE IF EXISTS `master_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `master_recipe` (
  `id` varchar(60) NOT NULL,
  `model` varchar(45) DEFAULT NULL,
  `frame` varchar(45) DEFAULT NULL,
  `screen` varchar(45) DEFAULT NULL,
  `keyboard` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_recipe`
--

LOCK TABLES `master_recipe` WRITE;
/*!40000 ALTER TABLE `master_recipe` DISABLE KEYS */;
INSERT INTO `master_recipe` VALUES ('MasterRec-15d4df8c-3a50-497e-8b6d-d6d477b1687b','X','frame3','screen3','keyboard3'),('MasterRec-4a153c7d-2e9e-42e0-b214-033895341817','W','frame3','screen3','keyboard3'),('MasterRec-4ab97d09-9b88-4b86-b0a5-e3582878ea2d','X','frame3','screen3','keyboard3'),('MasterRec-5685a0cd-befe-4b57-9160-ee013028bb7d','A','frame2','screen2','keyboard2'),('MasterRec-67fedadd-1be8-44b1-a3a1-7bf431e69d8b','undefined','frame3','screen3','keyboard3'),('MasterRec-7016a83e-e360-48ed-8115-e16028b8f51f','q','frame1','screen3','keyboard1'),('MasterRec-94b54686-fa14-41de-b056-6b0ab5fa8da5','B','frame2','screen2','keyboard2'),('MasterRec-c16e90ac-7c06-4397-b0e1-c293f14c85ba','C','frame1','screen3','keyboard1');
/*!40000 ALTER TABLE `master_recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materials` (
  `material_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `supplier` varchar(45) DEFAULT NULL,
  `assign_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` varchar(45) NOT NULL,
  `product` varchar(45) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `delivery` date DEFAULT NULL,
  `customer` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('09f9f809-6f69-4542-9aaf-38543a835ed1','Laurin_etuhammas',1,'2014-05-20',NULL,'0'),('1','testProduct',3,'2029-04-20',NULL,'0'),('11652b0a-7659-4602-8602-b8ce807e67e4','ProDuctTape_XXL',1000,'2001-01-20',NULL,'0'),('4ebfc943-b8a6-42ad-a45d-5d965edcfb42','Laurin_Viisaudenhammas',2,'2015-05-20',NULL,'0'),('5059763e-6d00-4329-9048-11ce01308979','toothpick',245,'2011-05-20','Santa Claus','in progress'),('636f73f6-baeb-4c7e-92f3-80d617423465','ProDuctTape',2,'2001-01-20',NULL,'0'),('7df4f24e-2904-418b-b192-6b1cd5e2f6d0','ProDuctTape',2,'2001-01-20',NULL,'0'),('874b858f-5bcc-4914-ae16-4870ad770823','ProDuctTape_XLarge',1000,'2001-01-20',NULL,'0'),('d05406a4-ef90-4e2c-9db6-433ce1c1c1a9','ProDuctTape_XLarge',1000,'2001-01-20',NULL,'0'),('d101e66d-b694-4a20-98f5-bed2db7a2076','toothpick',245,'2011-05-20','Peter Forsberg','in progress'),('f943ecc9-d2d1-4bac-9972-c6553c1e73cc','Bisse',245,'2011-05-20','Pettynyt Suomalainen','in progress'),('fda63932-f58a-4e5f-a82f-32f56258c8ac','ProDuctTape',2,'2001-01-20',NULL,'0');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `product_number` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(45) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `customer` varchar(45) DEFAULT NULL,
  `order_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`product_number`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Bisse',245,'Pettynyt Suomalainen','f943ecc9-d2d1-4bac-9972-c6553c1e73cc');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchases` (
  `purchase_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`purchase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-10 14:43:54
