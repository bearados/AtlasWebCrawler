import React, { Component } from 'react'
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import {Router, Route, Link} from 'react-router-dom'
import loading from '../images/loading.gif'


class Results extends Component {
    constructor(props){
        super(props);
        this.state ={
            // data that will be displayed
            // data: {},
            loading: true,
            data: {
                "nodes": [ 
                    { 
                      "id": "id1", // used to make the link
                      "name": "name1", // what will be displayed on node hover
                      "link" : "https://www.google.com", // what it will link to when clicked
                      "keyword" : "true" // used to determine if the node should be highlighted

                    },
                    { 
                        "id": "id2",
                        "name": "name2",
                      //   "val": 10,
                        "link" : "https://www.youtube.com",
                        "keyword" : "false" 
                      },],
                      "links": [
                        {
                            "source": "id1",
                            "target": "id2"
                        },]
                }

        }
    }
    getResults = () => {

        if(this.props.history.location.state.param.searchType === "bfs")
        {
            fetch('http://localhost:5000/bfs', {
                method: 'POST',
                // params passed in through history props
                body: this.props.history.location.state.param
            }).then((response)=>
                response.json()
            ).then(data=>(
                // console.log(data)
                // fix this once getting data formatted correctly from api
                // this.setState({data: data, loading: false})
                this.setState({loading: false})
                )
            ).catch(error =>
                console.log(error)
            )
        }
        else{
            fetch('http://localhost:5000/dfs', {
                method: 'POST',
                // params passed in through history props
                body: this.props.history.location.state.param
            }).then((response)=>
                response.json()
            ).then(data=>(
                // console.log(data)
                // fix this once getting data formatted correctly from api
                // this.setState({data: data, loading: false})
                this.setState({loading: false})
                )
            ).catch(error =>
                console.log(error)
            )
        }
    }
    
    componentDidMount = () =>{
        this.getResults();
    }


  render() {
    
    return (
      <div>
        <h1>Crawl Results</h1>

        <div style={{paddingTop: "3%"}}>
        {
            // this will contain the variables needed to make the api call
            console.log(this.props.history.location.state.param)
        }

        {/* 
            NPM package to display the results
            Documentation at: https://github.com/vasturiano/react-force-graph
        */}
        {
            !this.state.loading? 
            <ForceGraph2D
            graphData={this.state.data}
            height={500}
            nodeAutoColorBy="keyword"
            backgroundColor="grey"
            showNavInfo="true"
            onNodeClick={(node) => {window.location.assign(node.link)}}
            />
            :
            // add loading spinner
            <div >
                <img src={loading} style={{width: "50%", height: "50%"}}/>
            </div>
            
        }
        {/* 
            Legend that tells the user about the graph
        */}

            <div className="container">
                <div style={{border: "1px solid black"}}>
                    <h1>LEGEND</h1>
                    <div>
                        <div style={{display: "inline"}}>
                            <span className="dot" style={{
                                height: "25px",
                                width: "25px",
                                border: "1px solid black",
                                backgroundColor: "#cce6ff",
                                borderRadius: "50%",
                                display: "inline-block",
                            }}></span>
                            <h3 style={{display:"inline-block", paddingLeft:"2%"}}>Contain key words</h3>

                            <br></br>

                            <span className="dot" style={{
                                height: "25px",
                                width: "25px",
                                border: "1px solid black",
                                backgroundColor: "#3399ff",
                                borderRadius: "50%",
                                display: "inline-block",
                            }}></span>
                            <h3 style={{display:"inline-block", paddingLeft:"2%"}}>Does not contain key words</h3>

                        </div>
                        <div>
                            <h3>Note: Double clicking on node will redirect you to website</h3>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>

            {/* Gives user the option to conduct a new crawl */}
            <div>
                <Link to='/'>
                <button >NEW CRAWL
                </button>
                
                </Link>

            </div>

        </div>
      </div>
    )
  }
}

export default Results
