import { FoldersService, getFoldersService } from '../services/folders.service';

const foldersService: FoldersService = getFoldersService();

export const findFolderById = async (folderId: string) =>
  await foldersService.getFolderById(folderId);
