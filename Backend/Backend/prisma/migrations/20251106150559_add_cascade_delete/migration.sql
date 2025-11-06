-- DropForeignKey
ALTER TABLE `timelog` DROP FOREIGN KEY `TimeLog_taskId_fkey`;

-- DropIndex
DROP INDEX `TimeLog_taskId_fkey` ON `timelog`;

-- AddForeignKey
ALTER TABLE `TimeLog` ADD CONSTRAINT `TimeLog_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
