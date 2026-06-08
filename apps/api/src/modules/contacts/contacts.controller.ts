import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Contacts')
@Controller()
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Public()
  @Get('api/contacts/search')
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'titleId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  search(
    @Query('q') q?: string,
    @Query('departmentId') departmentId?: string,
    @Query('titleId') titleId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contactsService.search(
      q,
      departmentId ? +departmentId : undefined,
      titleId ? +titleId : undefined,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Public()
  @Get('api/contacts/:id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Post('api/admin/contacts')
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  @ApiBearerAuth()
  @Put('api/admin/contacts/:id')
  update(@Param('id') id: string, @Body() dto: CreateContactDto) {
    return this.contactsService.update(+id, dto);
  }

  @ApiBearerAuth()
  @Delete('api/admin/contacts/:id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }

  @ApiBearerAuth()
  @Get('api/admin/contacts')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  adminList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
  ) {
    return this.contactsService.search(
      q,
      undefined,
      undefined,
      page ? +page : 1,
      limit ? +limit : 50,
    );
  }

  @ApiBearerAuth()
  @Get('api/admin/stats')
  getStats() {
    return this.contactsService.getStats();
  }
}
