import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import $ from "jquery";

class LogWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            log:'',
            };
        this.getLog = this.getLog.bind(this);
    }

    componentDidMount() {
            this.interval = setInterval(this.getLog.bind(this, this.props.webAPIParam) , 1500);
            
    }

    componentWillUnmount() {
    //
    }

    getLog(){

        var requestParam = {"jsonrpc":"2.0", "method":this.props.webAPIParam, "params":"", "id":""}


        $.ajax({
            type: 'GET',
            url: 'http://vz01:8070/ReadLogFile',
            dataType: 'json',
            data: requestParam,
        }).done(function(res) {
                this.setState(prevState => ( {log : res.result.log, } ));
                //scroll            
                $('#logTextInput' + this.props.webAPIParam).animate({scrollTop: $('#logTextInput' + this.props.webAPIParam)[0].scrollHeight}, 'slow');


        }.bind(this))
            .fail(function(xhr, status, err) {
                    console.error(status, err.toString());
        }.bind(this));


    }


    render() {
        var stylePaper = {
                         width:'620px',
                         height:'220px',
                         background:'linear-gradient(to bottom, #050505 0%, #050505 100%)',
                         marginBottom:'30px',
                         }

        var stylePre = {whiteSpace:'pre-wrap', wordWrap:'normal', overflowY:'auto',
                         width:'600px',
                         height:'200px',
                         padding:'10px',
                         color:'#11FF22',
                         };

        var styleLogTitle = {color:'#444444', verticalAlign:'top',} 
        return (
            <MuiThemeProvider  muiTheme={getMuiTheme(lightBaseTheme)}>
            <div>

                <div style={styleLogTitle}>
                   <FontIcon className="material-icons" style={styleLogTitle}>dvr</FontIcon> {this.props.serverName} Log 
                </div>
                <div>
                    <Paper style={stylePaper} zDepth={2} >
                    <pre style={stylePre} id={'logTextInput' + this.props.webAPIParam}>
                    {this.state.log}
                    </pre>
                    </Paper>
                </div>

            </div>
            </MuiThemeProvider>
        );      
    }
}


export default LogWindow;
