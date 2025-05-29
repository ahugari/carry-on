declare module "expo-router" {
  type RouteGroups = {
    "(tabs)": {
      "profile": undefined;
      "messages": undefined;
      "home": undefined;
      "search": undefined;
    };
    "(settings)": {
      "reviews": undefined;
      "payment-methods": undefined;
      "help-center": undefined;
      "trust-safety": undefined;
      "add-payment-method": undefined;
    };
    "(auth)": {
      "login": undefined;
      "register": undefined;
    };
  };

  type Routes = {
    "/": undefined;
    "/trip-history": undefined;
    "/chat/[id]": undefined;
  };

  type AppRoutes = Routes & {
    [K in keyof RouteGroups]: {
      [P in keyof RouteGroups[K]]: RouteGroups[K][P];
    };
  };

  type GroupPath<Group extends keyof RouteGroups> = `${Group}/${keyof RouteGroups[Group] & string}`;
  type RoutePaths = keyof Routes | GroupPath<keyof RouteGroups>;

  export type TypedRouter = {
    push: (route: RoutePaths | string) => void;
    replace: (route: RoutePaths | string) => void;
    back: () => void;
  };

  export function useRouter(): TypedRouter;
  export { Stack } from 'expo-router/stack';
} 