import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { UploadModule } from './modules/upload/upload.module';
import { ImportModule } from './modules/import/import.module';
import { TitlesModule } from './modules/titles/titles.module';
import { TipsModule } from './modules/tips/tips.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ModulesModule } from './modules/modules/modules.module';
import { MealPlanModule } from './modules/meal-plans/meal-plan.module';
import { FoodItemsModule } from './modules/food-items/food-items.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { VesayetModule } from './modules/vesayet/vesayet.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ContactsModule,
    DepartmentsModule,
    UploadModule,
    TitlesModule,
    TipsModule,
    SettingsModule,
    ModulesModule,
    MealPlanModule,
    FoodItemsModule,
    AnalyticsModule,
    VesayetModule,
    ImportModule,
  ],
})
export class AppModule {}
