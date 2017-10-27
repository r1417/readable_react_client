//import React, { Component } from 'react';
import React from 'react';
//import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import AppBar from 'material-ui/AppBar';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import LogWindow from './LogWindow';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import $ from "jquery";

class TcpConsole extends React.Component {


    constructor(props) {
        super(props);

       const defaultConsoleText = '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';

        this.state = {
            connected: false,
            clientID: 0,
            connectionID: 0,
            log:defaultConsoleText,
            command:'',
            commandList:['hello', 'bye', 'now?', 'test2'],
            connectionDialogIsOpen: false,
            };
        this.connectChange = this.connectChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.commandTextChange = this.commandTextChange.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    //
    }

    commandTextChange(value){
        this.setState({
          command: value,
        });    
    }

    connectChange(e, isChecked){
        if(isChecked == undefined){
            isChecked = !this.state.connected;
        }
        if(isChecked){
            this.setState({connectionDialogIsOpen: true});    

            $.ajax({
                type: 'GET',
                url: 'http://vz01:8070/TcpConnect',
                dataType: 'json',
                data: {},
                cache:false,
            }).done(function(res) {
                        this.setState(prevState => ({
                            log :prevState.log + '\n\n'
                                 + 'command: ' + res.result.command + '\n'
                                 + 'message: ' + res.result.message + '\n'
                                 + 'response body: ' + JSON.stringify(res),
                            clientID:res.result.cid,
                            connectionID:res.id,  
                        }));
                        this.setState({connected: true});    

                        //scroll            
                        $('#console').animate({scrollTop: $('#console')[0].scrollHeight}, 'slow');

                        //dialog
                        this.timeout = setTimeout(this.setState.bind(this, {connectionDialogIsOpen: false}) , 5000);

                    


            }.bind(this))
            .fail(function(xhr, status, err) {
                    this.setState({connected: false});    
                    console.error(status, err.toString());
            }.bind(this));
        
        }else{
            this.send('bye');
        }
        return false
    }


    handleKeyPress(e){
        if(e.key == 'Enter'){
            this.send();
        }
    }


    send(command){
        var cmd = this.state.command;
        if(command != undefined && command != '')  cmd = command;

        var requestParam = {"jsonrpc":"2.0", "method":cmd, "params":"", "id":this.state.clientID}


        $.ajax({
            type: 'GET',
            url: 'http://vz01:8070/Command?cid=' + this.state.clientID,
            dataType: 'json',
            data: requestParam,
        }).done(function(res) {
                this.setState(prevState => ({
                            log :prevState.log + '\n\n'
                                 + 'command: ' + res.result.command + '\n'
                                 + 'message: ' + res.result.message + '\n'
                                 + 'response body: ' + JSON.stringify(res),
                            clientID:res.result.cid,
                            connectionID:res.id,  
                        }));

                //scroll            
                $('#console').animate({scrollTop: $('#console')[0].scrollHeight}, 'slow');

                if(res.result.command=='bye' || res.result.cid==''){
                    this.setState({connected: false});    
                }
                this.setState({command: '',});
                this.commandTextInput.focus();
        }.bind(this))
            .fail(function(xhr, status, err) {
                    console.error(status, err.toString());
        }.bind(this));


    }


    render() {

        const styleLayaoutParent = {width:'1310px',
                                  paddingLeft:'40px',
                                  paddingTop:'20px',
                                  
                                  }
        var styleLayaoutLeft = {float:'left', marginBottom:'30px'}
        var styleLayaoutRight = {float:'right'}

        var styleTitle = {
                         fontSize: '120%',
                         color:'#444444'
                         }

        var stylePaper = {
                         width:'620px',
                         height:'520px',
                         background:'linear-gradient(to bottom, #00BCD4 0%, #E0F7FA 100%)',
                         }

        var stylePre = {whiteSpace:'pre-wrap', wordWrap:'normal', overflowY:'auto',
                         width:'600px',
                         height:'500px',
                         padding:'10px',
                         color:'#00838F',
                         };

        var styleLogTitle = {color:'#444444', verticalAlign:'top',} 
        var styleCommand = {color:'#80DEEA', verticalAlign:'baseline',} 
        var styleStatusBar = {color:'#444444',  background:'#eeeeee', height:'50px', fontSize: '70%', }
        var styleConnect = {maxWidth:'100px', paddingTop:'20px', float:'left',}
        var styleConnectIcon = {color:'#FFB74D', verticalAlign:'middle',} 
        var styleStatusRight = {float:'right', marginTop:'-21px', marginRight:'10px', padding:'0px',}
        var styleStatusBadge = {top: '30px', right: '5px',}

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
};


        return (
            <MuiThemeProvider  muiTheme={getMuiTheme(lightBaseTheme)}>
            <div>

                <AppBar
                    title={<FlatButton
                                label={"Readable TCP CLient"}
                                labelStyle={styleTitle}
                                icon={<FontIcon className="material-icons" style={styleTitle}>{this.state.connected ? "cast_connected" : "cast"} </FontIcon>}
                            />
                          }
                    showMenuIconButton={false}
                    iconElementRight={
                                        <FlatButton label={this.state.connected ? "bye" : "connect"}
                                                labelStyle={styleTitle}
                                                onClick={this.connectChange}
                                                icon={<FontIcon className="material-icons"  style={styleTitle}>{this.state.connected ? "directions_run" : "compare_arrows"} </FontIcon>}
                                                labelPosition="before"/>
                                    }
                />


                <div style={styleLayaoutParent}>

                    <div style={styleLayaoutLeft}>
                        <div style={styleLogTitle}>
                           <FontIcon className="material-icons" style={styleLogTitle}>assignment</FontIcon> Command Console 
                        </div>
                        <div>
                            <Paper style={stylePaper} zDepth={2} >
                            <pre style={stylePre} id='console'>
                            {this.state.log}
                            </pre>
                            </Paper>
                              

                            Command<FontIcon className="material-icons" style={styleCommand}>rss_feed</FontIcon>&nbsp;
                            <AutoComplete
                                      name={'CommandText'}
                                      floatingLabelText=" Type Command"
                                      searchText={this.state.command}
                                      onUpdateInput={this.commandTextChange}
                                      dataSource={this.state.commandList}
                                      openOnFocus={true}
                                      onNewRequest={this.send}
                                      ref={(input) => { this.commandTextInput = input; }}
                                      />

                        </div>
                    </div>

                    <div style={styleLayaoutRight}>
                        <LogWindow webAPIParam='WebAPIServer' serverName="Web API Server" />
                    </div>

                    <div style={styleLayaoutRight}>
                        <LogWindow webAPIParam='TcpServer' serverName="TCP Server"  />
                    </div>
                </div>

                <AppBar
                    title={<div style={styleStatusBar}>
                                <div style={styleConnect}>
                                    <Toggle label={<div><FontIcon className="material-icons" style={styleConnectIcon}>flash_on</FontIcon>Connect</div>} toggled={this.state.connected} onToggle={this.connectChange} />
                                </div>

                                <div style={styleStatusRight}>
                                    <Badge badgeContent={this.state.clientID} secondary={true}  badgeStyle={styleStatusBadge} > Client ID </Badge>
                                    <Badge badgeContent={this.state.connectionID} primary={true} badgeStyle={styleStatusBadge}> Connection ID </Badge>
                                </div>
                            </div>
                        }
                    showMenuIconButton={false}
                    style={styleStatusBar}
                />
                
                <Dialog
                  title={<div><FontIcon className="material-icons" style={styleConnectIcon}>flash_on</FontIcon>Connecting...</div>}
                  modal={true}
                  contentStyle={customContentStyle}
                  open={this.state.connectionDialogIsOpen}
                >
                    <div style={{textAlign:'center', width:'100%'}}>
                        <CircularProgress size={40} thickness={3} />
                        <div style={{display:'inline-block',  verticalAlign:'40%', height:'100%',  fontSize: '120%', paddingLeft:'20px', paddingRight:'80px'}}>
                          TCP Client -> TCP Server. 
                        </div>
                    </div>
                </Dialog>

            </div>



            </MuiThemeProvider>
        );      
    }
}


export default TcpConsole;
