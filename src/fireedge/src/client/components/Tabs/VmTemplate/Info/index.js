/* ------------------------------------------------------------------------- *
 * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { ReactElement } from 'react'
import PropTypes from 'prop-types'
import { Stack } from '@mui/material'

import {
  useGetTemplateQuery,
  useChangeTemplatePermissionsMutation,
  useChangeTemplateOwnershipMutation,
} from 'client/features/OneApi/vmTemplate'
import { Permissions, Ownership } from 'client/components/Tabs/Common'
import Information from 'client/components/Tabs/VmTemplate/Info/information'
import * as Helper from 'client/models/Helper'

/**
 * Renders mainly information tab.
 *
 * @param {object} props - Props
 * @param {object} props.tabProps - Tab information
 * @param {string} props.id - Template id
 * @returns {ReactElement} Information tab
 */
const VmTemplateInfoTab = ({ tabProps = {}, id }) => {
  const {
    information_panel: informationPanel,
    permissions_panel: permissionsPanel,
    ownership_panel: ownershipPanel,
  } = tabProps

  const [changeOwnership] = useChangeTemplatePermissionsMutation()
  const [changePermissions] = useChangeTemplateOwnershipMutation()
  const { data: template = {} } = useGetTemplateQuery({ id })
  const { ID, UNAME, UID, GNAME, GID, PERMISSIONS } = template

  const handleChangeOwnership = async (newOwnership) => {
    await changeOwnership({ id: ID, ...newOwnership })
  }

  const handleChangePermission = async (newPermission) => {
    await changePermissions({ id: ID, ...newPermission })
  }

  const getActions = (actions) => Helper.getActionsAvailable(actions)

  return (
    <Stack
      display="grid"
      gap="1em"
      gridTemplateColumns="repeat(auto-fit, minmax(480px, 1fr))"
      padding="0.8em"
    >
      {informationPanel?.enabled && (
        <Information
          actions={getActions(informationPanel?.actions)}
          template={template}
        />
      )}
      {permissionsPanel?.enabled && (
        <Permissions
          actions={getActions(permissionsPanel?.actions)}
          ownerUse={PERMISSIONS.OWNER_U}
          ownerManage={PERMISSIONS.OWNER_M}
          ownerAdmin={PERMISSIONS.OWNER_A}
          groupUse={PERMISSIONS.GROUP_U}
          groupManage={PERMISSIONS.GROUP_M}
          groupAdmin={PERMISSIONS.GROUP_A}
          otherUse={PERMISSIONS.OTHER_U}
          otherManage={PERMISSIONS.OTHER_M}
          otherAdmin={PERMISSIONS.OTHER_A}
          handleEdit={handleChangePermission}
        />
      )}
      {ownershipPanel?.enabled && (
        <Ownership
          actions={getActions(ownershipPanel?.actions)}
          userId={UID}
          userName={UNAME}
          groupId={GID}
          groupName={GNAME}
          handleEdit={handleChangeOwnership}
        />
      )}
    </Stack>
  )
}

VmTemplateInfoTab.propTypes = {
  tabProps: PropTypes.object,
  id: PropTypes.string,
}

VmTemplateInfoTab.displayName = 'VmTemplateInfoTab'

export default VmTemplateInfoTab