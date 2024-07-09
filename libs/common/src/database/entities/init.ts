import { LoginHistory } from './identity/loginHistory.entity';
import { Notification } from './identity/notification.entity';
import { OneTimePassword } from './identity/otp.entity';
import { Users } from './identity/users.entity';
import { Profile } from './core/profile.entity';
import { Product } from './core/product.entity';
import { Supplier } from './core/supplier.entity';
import { CustomerAddress } from './core/custAddress.entity';
import { AddressBook } from './core/addressBook.entity';
import { ProductSearchHistory } from './core/prodSearchHist.enum';
import { ProductSpecification } from './core/prod-specs.entity';
import { ProductSponsorShip } from './core/prodSpons.entity';
import { LikedProduct } from './core/likedProduct.entity';
import { Category } from './core/category.entity';
import { PaymentMethod } from './core/payMethod.entity';
import { OrderDetails } from './core/order-details.entity';
import { Cart } from './core/cart.entity';
import { AccoutDetails } from './core/accountDetails.entity';
import { CardDetails } from './core/cardDetails.entity';
import { DispatchDetails } from './core/dispatchDetails.entity';
import { CustomerFeedback } from './core/custFeedback.entity';
import { DeliveryDetails } from './core/deliveryDetails.entity';
import { ContactUs } from './core/contactUs.entity';

export const entities = [
  LoginHistory,
  Notification,
  OneTimePassword,
  Users,
  Profile,
  Product,
  Supplier,
  CustomerAddress,
  AddressBook,
  ProductSearchHistory,
  ProductSpecification,
  ProductSponsorShip,
  LikedProduct,
  Category,
  PaymentMethod,
  OrderDetails,
  Cart,
  AccoutDetails,
  CardDetails,
  DispatchDetails,
  DeliveryDetails,
  CustomerFeedback,
  ContactUs,
];
