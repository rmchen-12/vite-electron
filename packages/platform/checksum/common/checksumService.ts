/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from 'platform/instantiation/common/instantiation';

export const IChecksumService = createDecorator<IChecksumService>('checksumService');

export interface IChecksumService {

  readonly _serviceBrand: undefined;

  checksum(): void;
}