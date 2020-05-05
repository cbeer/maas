import React from "react"
import { ActionCableConsumer, ActionCableProvider } from 'react-actioncable-provider';
import MiradorStateChannel from 'channels/mirador_state_channel';
import { v4 as uuidv4 } from 'uuid';

const session_token = uuidv4();

class MiradorActionCableComponent extends React.Component {
  handleReceivedMessage = response => {
    console.log("received:");
    console.log(response);

    const { dispatch } = this.props;
    if (response.from != session_token) {
      dispatch(response);
    }
  }

  render () {
    return (
      <ActionCableProvider url="ws://127.0.0.1:3000/cable">
        <ActionCableConsumer
          channel={{ channel: 'MiradorStateChannel' }}
          onReceived={this.handleReceivedMessage}
          />
        <this.props.TargetComponent {...this.props} />
      </ActionCableProvider>
    );
  }
}

const initialState = {};

const pluginStateReducer = (state = initialState, action) => {
  console.log("sent:");
  console.log(action);
  if (!action.from) {
    // switch (action['type']) {
    //   case 'mirador/ADD_WINDOW':
    //   case 'mirador/REQUEST_ANNOTATION':
    //   // case 'mirador/REQUEST_INFO_RESPONSE':
    //   case 'mirador/FOCUS_WINDOW':
    //   case 'mirador/REQUEST_MANIFEST':
    //   case 'mirador/UPDATE_WORKSPACE_MOSAIC_LAYOUT':
    //   case 'mirador/REMOVE_WINDOW':
        MiradorStateChannel.send({ ...action, from: session_token});
    // }
  }
  return state;
}

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

const plugin = {
    target: 'BackgroundPluginArea',
    mode: 'wrap',
    component: MiradorActionCableComponent,
    mapDispatchToProps: mapDispatchToProps,
    reducers: {
       pluginState: pluginStateReducer,
    },
};

export default plugin;
