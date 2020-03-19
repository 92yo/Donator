import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import FormHelperText from "@material-ui/core/FormHelperText";
import { getRequest } from "../../utils/axios.js";
import Cookie from "js-cookie";
import Message from "../Message";

const useStyles = makeStyles(theme => ({
  HelperText: {
    display: "flex",
    justifyContent: "center",
    width: 100
  },
  Radio: {
    display: "flex",
    width: 50
  }
}));

export default function RadioButtons({donateInfo, setDonateInfo}) {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState(0);
  const token = Cookie.get("token") ? Cookie.get("token") : null;
  const [orgInfo, setOrgInfo] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    fetchOrgInfo();
  }, [token]);

  const fetchOrgInfo = () => {
    getRequest("/orgInfo", token)
      .then(res => {
        res.data.error ? (window.location = "/") : setOrgInfo(res.data.orgInfo);
      })
      .catch(err => setErrorMsg(err));
  };

  const handleChange = event => {
    setSelectedValue(event.target.value);
    setDonateInfo({...donateInfo, org_id: event.target.value})
  };

  return (
    <div>
      <h2>
        <center>Select an Organization</center>
      </h2>
      {errorMsg ? (
        <Message message={errorMsg} severity={"error"} />
      ) : (
        orgInfo.map((org, i) => (
          <div key={i}>
            <FormHelperText className={classes.HelperText}>
              {org.name}
            </FormHelperText>
            <Radio
              className={classes.Radio}
              checked={selectedValue == org.id}
              onChange={handleChange}
              value={org.id}
              name="radioButton"
              inputProps={{ "aria-label": org.name }}

            />
          </div>
        ))
      )}
    </div>
  );
}
