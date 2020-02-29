import { AdminError } from './admin.error';
import { promisify } from 'util';

import { compileErrorReport } from '../../../utils/functions';

const PlayFab: PlayFabModule.IPlayFab = require('playfab-sdk/Scripts/PlayFab/PlayFab'); // eslint-disable-line
const PlayFabAdmin: PlayFabAdminModule.IPlayFabAdmin = require('playfab-sdk/Scripts/PlayFab/PlayFabAdmin'); // eslint-disable-line

const asyncBanUsers = promisify(PlayFabAdmin.BanUsers);

export const banUsers = async(titleId: string, bans: Array<PlayFabAdminModels.BanRequest>) => {
  PlayFab.settings.titleId = titleId;
  const requestPrepared: PlayFabAdminModels.BanUsersRequest = {
    Bans: bans,
  };
  let result;
  try {
    result = await asyncBanUsers(requestPrepared);
  } catch (err) {
    result = new AdminError(501, `Something went wrong with API call: ${compileErrorReport(err)}`);
  }
  return result;
};
