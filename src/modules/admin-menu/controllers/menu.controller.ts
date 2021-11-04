import {Controller, Get, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {NestedTreeNode} from "../responses/nested-tree-node";
import {MenuService} from "../menus/menu.service";

@Controller('menu')
export class MenuController {

  constructor(
    private readonly menuService: MenuService
  ) { }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMenu(): Promise<NestedTreeNode[]> {
    return this.menuService.getMenu();
  }
}