import { promisify } from 'util';

import { ClientError } from './client.error';
import ClientType from './client.type';
import { compileErrorReport } from '../../../utils/functions';

const PlayFab: PlayFabModule.IPlayFab = require('playfab-sdk/Scripts/PlayFab/PlayFab'); // eslint-disable-line
const PlayFabClient: PlayFabClientModule.IPlayFabClient = require('playfab-sdk/Scripts/PlayFab/PlayFabClient'); // eslint-disable-line

const asyncLoginWithCustomID = promisify(PlayFabClient.LoginWithCustomID);
const asyncGetPhotonAuthenticationToken = promisify(PlayFabClient.GetPhotonAuthenticationToken);
const asyncGetContentDownloadUrl = promisify(PlayFabClient.GetContentDownloadUrl);

export const loginWithCustomId = async(titleId: string, customId: string) => {
  PlayFab.settings.titleId = titleId;
  const requestPrepared: PlayFabClientModels.LoginWithCustomIDRequest = {
    CustomId: customId,
    CreateAccount: true
  };
  let result;
  try {
    result = await asyncLoginWithCustomID(requestPrepared);
  } catch (err) {
    result = new ClientError(501, `Something went wrong with API call: ${compileErrorReport(err)}`);
  }
  return result;
};

export const getPhotonAuthenticationToken = async(titleId: string, photonApplicationId: string) => {
  PlayFab.settings.titleId = titleId;
  const requestPrepared: PlayFabClientModels.GetPhotonAuthenticationTokenRequest = {
    PhotonApplicationId: photonApplicationId
  };
  let result;
  try {
    result = await asyncGetPhotonAuthenticationToken(requestPrepared);
  } catch (err) {
    result = new ClientError(501, `Something went wrong with API call: ${compileErrorReport(err)}`);
  }
  return result;
};

export const getContentDownloadUrl = async(titleId: string, httpMethod: ClientType.Method, key: string, thruCdn: boolean) => {
  PlayFab.settings.titleId = titleId;
  const requestPrepared: PlayFabServerModels.GetContentDownloadUrlRequest = {
    HttpMethod: httpMethod,
    Key: key,
    ThruCDN: thruCdn
  };
  let result;
  try {
    result = await asyncGetContentDownloadUrl(requestPrepared);
  } catch (err) {
    result = new ClientError(501, `Something went wrong with API call: ${compileErrorReport(err)}`);
  }
  return result;
};
