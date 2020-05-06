import React from "react"
import { ActionCableConsumer, ActionCableProvider } from 'react-actioncable-provider';
import MiradorStateChannel from 'channels/mirador_state_channel';
import { v4 as uuidv4 } from 'uuid';

const session_token = uuidv4();

class MiradorActionCableComponent extends React.Component {
  handleReceivedMessage = response => {
    const { workspaceId } = this.props;

    console.log("received:");
    console.log(response);

    const { dispatch } = this.props;
    if (response.workspaceId == workspaceId && response.from != session_token) {
      dispatch(response);
    }
  }

  componentDidMount() {
    const { channel, workspaceId } = this.props;

    channel.follow(workspaceId, this.handleReceivedMessage);
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.unfollow(workspaceId);
  }

  render () {
    const { channel } = this.props;

    return (
      <this.props.TargetComponent {...this.props} />
    );
  }
}

const initialState = {};

const pluginStateReducer = (state = initialState, action) => {
  if (!action.from) {
    switch (action['type']) {
      case 'mirador/IMPORT_MIRADOR_STATE':
        return { ...state, ...action.state.channels }
    //   case 'mirador/ADD_WINDOW':
    //   case 'mirador/REQUEST_ANNOTATION':
    //   // case 'mirador/REQUEST_INFO_RESPONSE':
    //   case 'mirador/FOCUS_WINDOW':
    //   case 'mirador/REQUEST_MANIFEST':
    //   case 'mirador/UPDATE_WORKSPACE_MOSAIC_LAYOUT':
    //   case 'mirador/REMOVE_WINDOW':
      default:
        if (state.workspaceId) MiradorStateChannel.broadcast({ ...action, workspaceId: state.workspaceId, from: session_token});
    }
  }
  return state;
}

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

const mapStateToProps = (state) => ({
  channel: MiradorStateChannel,
  workspaceId: state.channels.workspaceId,
});

const plugin = {
  target: 'BackgroundPluginArea',
  mode: 'wrap',
  component: MiradorActionCableComponent,
  mapDispatchToProps: mapDispatchToProps,
  mapStateToProps: mapStateToProps,
  reducers: {
     channels: pluginStateReducer,
  },
};

export default plugin;
