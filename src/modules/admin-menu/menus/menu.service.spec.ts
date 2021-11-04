import {MenuService} from "./menu.service";
import {ROOT_MENU_NODE_ID} from "./menu-node";

describe('MenuService Unit Test', () => {
  let menuService: MenuService;

  beforeEach(() => {
    menuService = new MenuService();
  });

  describe('Add node', () => {
    it('Initial Service must return empty array', () => {
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Node without connection with root should`t returned', () => {
      menuService.add({
        id: 'foo',
        parentId: 'bar',
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com'
      });
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Node with root node must be added', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com'
      });
      expect(menuService.getMenu()).toHaveLength(1);
    });
  });
});