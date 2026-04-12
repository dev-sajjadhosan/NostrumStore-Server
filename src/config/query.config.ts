import { IQueryConfig } from "../interface/query.interface";

// Medicines Config
export const medicinesSearchableFields = ["name", "genericName", "group", "category.name", "tags"];
export const medicinesFilterableFields = ["categoryId", "sellerId", "isPrescriptionRequired", "price", "discountPrice"];
export const medicinesIncludeConfig = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      comment: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  },
  orders: true,
};

// Categories Config
export const categoriesSearchableFields = ["name", "description"];
export const categoriesFilterableFields = ["status"];
export const categoriesIncludeConfig = {
  medicines: {
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
    },
  },
};

// Orders Config
export const ordersSearchableFields = ["id", "customer.name", "customer.email", "address"];
export const ordersFilterableFields = ["status", "customerId", "payment"];
export const ordersIncludeConfig = {
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  items: {
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },
  },
  orderReview: true,
};

// OrderItem Config
export const orderItemSearchableFields = ["order.id", "medicine.name"];
export const orderItemFilterableFields = ["orderId", "medicineId"];
export const orderItemIncludeConfig = {
  order: true,
  medicine: {
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
    },
  },
};

// Reviews Config
export const reviewsSearchableFields = ["user.name", "comment", "medicine.name"];
export const reviewsFilterableFields = ["userId", "medicineId", "rating"];
export const reviewsIncludeConfig = {
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  medicine: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
};

// OrderReview Config
export const orderReviewSearchableFields = ["user.name", "comment", "order.id"];
export const orderReviewFilterableFields = ["userId", "orderId", "rating"];
export const orderReviewIncludeConfig = {
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  order: {
    select: {
      id: true,
      totalPrice: true,
      status: true,
    },
  },
};

// User Config
export const userSearchableFields = ["name", "email"];
export const userFilterableFields = ["role", "status"];
export const userIncludeConfig = {
  profile: true,
  sessions: {
    select: {
      id: true,
      createdAt: true,
    },
  },
  medicines: {
    select: {
      id: true,
      name: true,
      price: true,
    },
  },
};

// Profile Config
export const profileSearchableFields = ["user.name", "address", "location"];
export const profileFilterableFields = ["userId"];
export const profileIncludeConfig = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
};

// Session Config
export const sessionSearchableFields = ["user.name", "token"];
export const sessionFilterableFields = ["userId"];
export const sessionIncludeConfig = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};
