import React, { useEffect, useState, useCallback, forwardRef } from "react";
import ChatBox from "./ChatBox";
import "../css/Chat.css";
import randy from "../../images/randy.jpg";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Button, Typography } from "@material-ui/core";
import RenderUser from "./RenderUser";
import { useStateValue } from "../../StateProvider";
import io from "socket.io-client";
const API = process.env.REACT_APP_API;

const socket = io("http://localhost:9000");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // "& > *": {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(100),
    //   height: theme.spacing(100),
    // },
  },
  leftpane: {
    flexDirection: "row",
    margin: theme.spacing(1),
    width: theme.spacing(50),
    height: theme.spacing(70),
  },
  rightpane: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(1),
    width: theme.spacing(100),
  },
  lefttop: {
    display: "flex",
    flex: 0,

    "& > *": {
      margin: theme.spacing(1),
      height: "fit-content",
    },
    padding: theme.spacing(1),
    alignItems: "center",
  },
  leftbody: {
    flex: 1,

    margin: theme.spacing(1),
  },
  chat__message: {},
  chat__divform: {
    flex: 0,
  },
  chat__formcontrol: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  chat__input: {
    flex: 1,
    width: "100%",
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  chat__iconbutton: {
    flex: 0,
  },
  chat__scrolltobottom: {
    minHeight: "200px",
    maxHeight: "470px",
  },
}));

const Chat = forwardRef(({ history }, ref) => {
  const classes = useStyles();
  const [profile, setProfile] = useState([]);
  const [
    {
      user_name,
      user_id,
      email,
      isChatOpen,
      peername,
      peerid,
      isLogin,
      notify,
    },
    dispatch,
  ] = useStateValue();

  const fetchData = useCallback(async () => {
    const resp = await fetch(`${API}/request/list/${user_id}`);
    const data = await resp.json();

    // console.log(data, " notification");
    try {
      setProfile(
        data.map((doc) => ({
          name: doc.name,
          id: doc.id,
          notification: doc.notification,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  }, [setProfile, user_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, notify, isChatOpen]);

  useEffect(() => {
    socket.on("message", fetchRequest);
    // return () => socket.off("message");
  }, []);

  const fetchRequest = (data) => {
    if (data.peerid === user_id) {
      console.log(data, "request add friend");
      alert(data.friend + ": Hi, I'll add you on my friends list thansk!");
    }
  };

  return (
    <div ref={ref} className={classes.root}>
      <Paper ref={ref} variant="outlined" className={classes.leftpane}>
        <div className={classes.lefttop}>
          <Avatar alt="pic" src={randy} />
          <Typography variant="body2" component="span">
            {user_name}
          </Typography>
          {/* <Button color="primary" variant="contained">
            Logout
          </Button> */}
        </div>
        <div ref={ref} className={classes.leftbody}>
          <Typography variant="h6" component="h6">
            Contacts
          </Typography>
          {isLogin ? <RenderUser ref={ref} profile={profile} /> : null}
        </div>
      </Paper>
      <Paper ref={ref} variant="outlined" square className={classes.rightpane}>
        {isChatOpen ? <ChatBox /> : null}
      </Paper>
    </div>
  );
});
export default Chat;
