/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChecksumService } from '../common/checksumService';
import { platform } from 'os';


export class ChecksumService implements IChecksumService {

  declare readonly _serviceBrand: undefined;

  async checksum(): Promise<string> {
    const cpus = platform();
    return Promise.resolve(cpus);
  }
}
