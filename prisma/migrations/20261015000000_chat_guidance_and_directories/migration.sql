-- AlterTable
ALTER TABLE "cooperatives" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "licensed_installers" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "faqs" ADD COLUMN     "followUps" TEXT[] DEFAULT ARRAY[]::TEXT[];
