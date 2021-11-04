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

    it('Leaf with href should be removed', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo'
      });
      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Node with same id should be override', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'foo',
        href: 'https://foo.com'
      });

      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });

      const menus = menuService.getMenu();
      expect(menus).toHaveLength(1);
      expect(JSON.stringify(menus[0])).toEqual(JSON.stringify(menus[0]));
    });

    it('Added nodes should create treeNodes structure', () => {
      menuService.add({
        id: 'bar',
        parentId: 'foo',
        sortOrder: 10,
        name: 'bar',
        href: 'https://bar.com'
      });

      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });

      const menus = menuService.getMenu();

      expect(menus).toHaveLength(1);
      expect(menus[0].id).toBe('foo');
      expect(menus[0].children).toHaveLength(1);
      expect(menus[0].children[0].id).toBe('bar');
    });

    it('Should safe treeNode structure', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        children: [
          {
            id: 'bar',
            parentId: 'foo',
            sortOrder: 10,
            name: 'bar',
            href: 'https://bar.com'
          }
        ]
      });

      const menus = menuService.getMenu();

      expect(menus).toHaveLength(1);
      expect(menus[0].id).toBe('foo');
      expect(menus[0].children).toHaveLength(1);
      expect(menus[0].children[0].id).toBe('bar');
    });
  });

  describe('Patch node', () => {
    it('Already added node may be changed', () => {
      menuService.patch({
        id: 'foo',
        sortOrder: 77
      });

      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });

      const menus = menuService.getMenu();
      expect(menus[0].sortOrder).toBe(77);
      expect(menus[0].name).toBe('foo');
    });

    it('Path should not add node', () => {
      menuService.patch({
        id: 'foo',
        sortOrder: 77
      });

      const menus = menuService.getMenu();
      expect(menus).toHaveLength(0);
    });

    it('May have more than 1 patch', () => {
      menuService.patch({
        id: 'foo',
        sortOrder: 77,
        href: 'https://bar.com'
      });

      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com',
      });

      menuService.patch({
        id: 'foo',
        sortOrder: 13,
        href: 'https://bar.com',
        name: 'bar'
      });

      const menus = menuService.getMenu();
      expect(menus[0].sortOrder).toBe(13);
      expect(menus[0].name).toBe('bar');
      expect(menus[0].href).toBe('https://bar.com');
    });
  });

  describe('Remove node', () => {
    it('Node should be removed by id', () => {
      menuService.remove('foo', 'bar');
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });

      expect(menuService.getMenu()).toHaveLength(0);
    });

    it('Undo remove', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });

      menuService.remove('foo', 'bar');
      menuService.patch(
        { id: 'foo', removed: false },
        { id: 'bar', removed: false },
      );

      expect(menuService.getMenu()).toHaveLength(1);
    });

    it('Patch and Remove should have same priority', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });

      menuService.patch(
        { id: 'foo', removed: false },
        { id: 'bar', removed: false },
      );
      menuService.remove('foo', 'bar');

      expect(menuService.getMenu()).toHaveLength(0);
    });
  });

  describe('Sorting', () => {
    it('Nodes should be sorted', () => {
      menuService.add({
        id: 'foo',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 20,
        name: 'foo',
        href: 'https://foo.com'
      });

      menuService.add({
        id: 'bar',
        parentId: ROOT_MENU_NODE_ID,
        sortOrder: 10,
        name: 'bar',
        href: 'https://bar.com'
      });

      const menus = menuService.getMenu();
      expect(menus[0].name).toBe('bar');
      expect(menus[1].name).toBe('foo');
    });
  });
});