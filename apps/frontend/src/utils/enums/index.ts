export enum RequestStatus {
  Init = "INIT",
  Loading = "LOADING",
  Success = "SUCCESS",
  Failed = "FAILED",
}

export enum Role {
  Owner = "OWNER",
  Manager = "MANAGER",
  Cashier = "CASHIER",
  Waiter = "WAITER",
  SuperAdmin = "SUPER_ADMIN",
}

export enum Food_Type {
  Vegetarian = "VEGETARIAN",
  NonVegetarian = "NON-VEGETARIAN",
  plant_based = "VEGAN",
}

export enum Spice_Scale {
  None = "NONE",
  Mild = "MILD",
  Moderate = "MODERATE",
  Spicy = "SPICY",
}

export enum Serving_Time {
  Breakfast = "BREAKFAST",
  Lunch = "LUNCH",
  Dinner = "DINNER",
  All_Time = "ALL_TIME",
}

export enum FoodCategory {
  Starters = "STARTERS",
  MainCourse = "MAIN_COURSE",
  Deserts = "DESERTS",
  Beverages = "BEVERAGES",
}

export enum QRTypes {
  TABLE = "TABLE",
  ROOM = "ROOM",
}

export enum EventTypes {
  NotificationTicketCreated = "NOTIFICATION_TICKET_CREATED",
}
