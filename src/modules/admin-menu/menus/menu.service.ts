import {Injectable} from "@nestjs/common";
import {MenuNode, PatchMenuNode, ROOT_MENU_NODE_ID} from "./menu-node";

@Injectable()
export class MenuService {
  private nodes: { [id: string]: MenuNode } = {};
  private patches: PatchMenuNode[] = [];

  /**
   * Get tree node
   *
   * if node hasn't found return empty array
   * All menus based from root
   * Leaf must have href otherwise should be deleted
   * Branches must not have href
   */
  getMenu(): MenuNode[] {
    const nodeMap: { [id: string]: MenuNode } = {};
    let src = Object.values(this.nodes).map(node => {
      const copy = { ...node };
      nodeMap[copy.id] = copy;
      return copy;
    });

    this.patches.forEach(patch => {
      if (nodeMap[patch.id]) {
        Object.assign(nodeMap[patch.id], patch);
      }
    });

    src = src.filter(node => !node.removed);
    return this.getMenuForNode(ROOT_MENU_NODE_ID, src);
  }

  private getMenuForNode(id: string, src: MenuNode[]): MenuNode[] {
    const res = src
      .filter(node => node.parentId === id)
      .map(({ href, ...node }) => {
        const children = this.getMenuForNode(node.id, src);

        if (children.length > 0) {
          return {
            ...node,
            children
          };
        }

        return {
          ...node,
          href,
          removed: !href,
          children: []
        };
      })
      .filter(node => !node.removed);

    res.sort((a, b) => a.sortOrder - b.sortOrder);
    return res;
  }

  /**
   * Add node configuration
   *
   * @param nodes
   */
  add(...nodes: MenuNode[]): void {
    nodes.forEach(node => {
      const sanitizedChildren = node.children?.map(child => ({
        ...child,
        parentId: node.id
      })) || [];

      const { children, ...sanitizedNode } = node;
      this.add(...sanitizedChildren);

      this.nodes[node.id] = sanitizedNode;
    });
  }

  /**
   * Patch tree node
   *
   * @param patches
   */
  patch(...patches: PatchMenuNode[]): void {
    this.patches = [
      ...this.patches,
      ...patches
    ];
  }

  /**
   * remove nodes from tree
   * @param ids
   */
  remove(...ids: string[]): void {
    this.patch(...ids.map(id => ({ id, removed: true })));
  }
}