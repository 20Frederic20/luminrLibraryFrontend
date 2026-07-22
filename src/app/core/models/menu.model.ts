export interface MenuItem {
  title: string;
  icon: string;
  baseRoute: string;
  actions: {
    label: string;
    route: string;
    icon: string;
  }[];
}
