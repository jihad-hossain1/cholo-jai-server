import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { searchRoutes } from "../modules/search/search.route";
import { LocationRoutes } from "../modules/location/location.route";
import { ConnectedLocationRoutes } from "../modules/connected-location/connected.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/location",
    route: LocationRoutes,
  },
  {
    path: "/connected-location",
    route: ConnectedLocationRoutes,
  },
  {
    path: "/search",
    route: searchRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
