import {Injectable} from "@nestjs/common";
import {MenuNode, PatchMenuNode} from "./menu-node";

@Injectable()
export class MenuService {

  /**
   * Get tree node
   *
   * if node hasn't found return empty array
   * All menus based from root
   * Leaf must have href otherwise should be deleted
   * Branches must not have href
   */
  getMenu(): MenuNode[] {
    return [];
  }

  /**
   * Add node configuration
   *
   * @param nodes
   */
  add(...nodes: MenuNode[]): void {
    // TODO add nodes
  }

  /**
   * Patch tree node
   *
   * @param nodes
   */
  patch(...nodes: PatchMenuNode[]): void {
    // TODO patch node
  }

  /**
   * remove nodes from tree
   * @param ids
   */
  remove(...ids: string[]): void {
    // TODO remove node
  }
}