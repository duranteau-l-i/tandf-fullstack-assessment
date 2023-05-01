import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import Item from "@/domain/entities/Item";
import ItemRepository from "@/infrastructure/entities/Item";
import AddItemInput from "../dtos/items/AddItemInput";

@Resolver(() => Item)
export class ItemResolver {
  constructor(
    @InjectRepository(ItemRepository)
    private readonly itemRepo: Repository<ItemRepository>
  ) {}

  @Query(() => [Item])
  async items(): Promise<Item[]> {
    return this.itemRepo.find();
  }

  @Mutation(() => Item)
  async addItem(@Arg("item") item: AddItemInput): Promise<Item> {
    const newItem = new Item();
    newItem.name = item.name;
    newItem.description = item.description;

    return this.itemRepo.save(newItem);
  }
}
