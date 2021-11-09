import React, { Component } from 'react';

import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  info,
} from '@patternfly/react-table';
import {
  CardTitle,
  CardBody,
  Card,
  CardFooter,
  Grid,
  GridItem,
  CardActions,
  Button,
} from '@patternfly/react-core';
import Client from '@fnndsc/chrisstoreapi';
import { PlusCircleIcon } from '@patternfly/react-icons';
import BrainyTeammatesPointer from '../../../../assets/img/brainy_teammates-pointer.png';
import ChrisStore from '../../../../store/ChrisStore';
import DashTeamView from "../DashTeamView/DashTeamView";
import './DashCollaboratorView.css';


const DashTeamEmptyState = () => (
  <div className="card-body-content-parent">
    <p>
      In this area, you will be able to add and manage coll to help you
      with each plugin.
    </p>
    <img style={{ marginLeft: '2em' }} src={BrainyTeammatesPointer} alt="Click Add Plugin" />
  </div>
);

class DashCollaboratorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: [],
      pluginData: undefined,
      errors: [],
      rows: [],
      columns: [
        {
          title: 'Name',
          property: 'username',
          
        },
        {
          title: 'Role',
          property: 'Role'
          
        },
        
      ],
      
    };
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get('authToken') };
    this.client = new Client(storeURL, auth);
    
  }

  async componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    const { pluginName } = this.props.match.params;
    try {
      const pluginMeta = await this.fetchPluginMeta(pluginName);
       alert(pluginMeta)
      const collaboratorList = await this.fetchPluginCollaborators(pluginMeta);
      
    	
     
      
     
     
    
       

      this.setState({
        loading: false,
          collaborators:[...collaboratorList]
       
      });
    } catch (error) {
      this.setState((prev) => ({
        loading: false,
        errors: [...prev.errors, error]
      }));
    }
  }
  
/**
  * Fetch all versions of a plugin.
  * @param {PluginMeta} pluginMeta
  * @returns {Promise<any[]>} Collaborators of the plugin
  */
  // eslint-disable-next-line class-methods-use-this
   async fetchPluginMeta(pluginName) {
    const metas = await this.client.getPluginMetas({ name_exact: pluginName, limit: 1 });
    return metas.getItems().shift();
  }
  async fetchPluginCollaborators(pluginMeta) {
    const collabitems = (await pluginMeta.getCollaborators()).getItems();
    const collablist=collabitems.map((collaborator, index) => collabitems[index].data)
    const collaboratorlist=collablist.map((collaborator, index) => collabitems[index])
    const collaborators=Array.from(collaboratorlist.values())
    console.log(collaborators)
    return collaborators
  
   ;
  }
 

  render() {
   
    const { rows, columns,errors,collaborators } = this.state;
    
    
   
    const showEmptyState = isEmpty(errors);
    

    return (
   
  
     
     
        <GridItem sm={12}>
          <Card>
            <CardTitle>Collaborators</CardTitle>
            { collaborators.map((collaborator) => (
                    <li key={collaborator.id}>
                      {collaborator.data.username}{collaborator.role}
                    </li>
                  ))}
            
                   <DashTeamView collaborators={collaborators} />
                  
            <CardBody>
              {showEmptyState ? (
                <DashTeamEmptyState />
              ) : (
                <>
                  <Table
                    aria-label="Sortable Table"
                    cells={columns}
                    rows={rows}
                    actions={([
                      {
                        title: <a href="https://www.patternfly.org">Link action</a>,
                      },
                      {
                        title: 'Some action',
                        // eslint-disable-next-line no-unused-vars
                        onClick: (event, rowId, rowData, extra) => {
                          // console.log('clicked on Some action, on row: ', rowId);
                        },
                      },
                      {
                        title: 'Third action',
                        // eslint-disable-next-line no-unused-vars
                        onClick: (event, rowId, rowData, extra) => {
                          // console.log('clicked on Third action, on row: ', rowId);
                        },
                      },
                    ])}
                    areActionsDisabled={false}
                    dropdownPosition="left"
                    dropdownDirection="bottom"
                  >
                    <TableHeader />
                    <TableBody />
                  </Table>
                </>
              )}
            </CardBody>
            
            <CardFooter
              className="card-footer"
            >
              <CardActions>
                <Button variant="secondary">
                  <PlusCircleIcon type="pf" style={{ margin: '0 1em 0 0' }} />
                  <span>Add Collaborator</span>
                </Button>
              </CardActions>
<h4></h4>
                  
                  
            </CardFooter>
            
          </Card>
        </GridItem>
      
    );
  }
}




DashCollaboratorView.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.shape({
      plugin: PropTypes.string,
    })
  })
};

DashCollaboratorView.defaultProps = {
  store: new Map(),
  match: {
    params: {
      plugin: undefined,
    }
  }
};

export default ChrisStore.withStore(DashCollaboratorView);
