/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from 'platform/ipc/electron-sandbox/services';
import { IChecksumService } from 'platform/checksum/common/checksumService';


registerSharedProcessRemoteService(IChecksumService, 'checksum', { supportsDelayedInstantiation: true });
