import React, { useState } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import PageHeader from "@/components/PageHeader";
import Layout from "@/components/layouts/ContentWithSidebar";
import notification from "antd/lib/notification";
import routes from "@/services/routes";
import Button from "antd/lib/button";
import CheckBox from "./components/CheckBox";
import DateRangePicker from "./components/DateRangePicker";
import SelectComponent from "./components/SelectComponent";
import axios from "axios";
import QueueTable from "./components/QueueTable";

import { currentUser } from "@/services/auth";

import "./queue.css";
import 'antd/lib/notification/style/index.css';

const ProvideData = () => {

  const [selectedValue, setSelectedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isChecked, setIsChecked] = useState(false);

  const openSuccessNotification = () => {
    notification.success({
      message: 'Success',
      placement: "bottomLeft",
      description: 'The queue has been successfully modified!',
      duration: 5, // Notification will hide after 5 seconds
    });
  };

  const openErrorNotification = () => {
    notification.error({
      message: 'Error',
      placement: "bottomLeft",
      description: 'There was an error submitting your data.',
      duration: 5, // Notification will hide after 5 seconds
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSelectValue = (value) => {
    setSelectedValue(value);
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = () => {
    try{
    // Post data to API
    const postData = {
      "equiptment_ID": selectedValue,
      "from": selectedDate[0].format('YYYY-MM-DD'),
      "to": selectedDate[1].format('YYYY-MM-DD'),
      "user": currentUser['name'],
      "dbName": "-",
      "state": 1, // Set State to Value 1 -> "Open"
      "KeepUpdated": isChecked 
    }
    axios.post('https://vs-proddash-dat.ad.vetter-group.de/api/queue', postData).then((response) => {
      if (response.status === 200) {
        openSuccessNotification();
      } else {
        openErrorNotification();
      }
    });
    }
    catch(e) {
        openErrorNotification();
    }

  };

  return (
    <div className="queue-page">
      <div className="container">
        <PageHeader title="Provide Historical Data" /> 
        <Layout>
          <Layout.Sidebar className="m-b-0">
            <div className="selectcomponent selectionitem">
              <h4>Add equiptment and date range to queue: </h4>
              <SelectComponent onChange={handleSelectValue}/>
            </div>
            <div className="daterangecomponent selectionitem">
              <DateRangePicker selectedDate={selectedDate} onChange={handleDateChange} />
              <div />
              <div className="checkboxcomponent selectionitem">
                <CheckBox checked={isChecked} onChange={handleCheckboxChange} />
                {isChecked && <p style={{ color: 'red' }}>Warning: This option results in higher data usage and should only be considered if neccessary!</p>}
              </div>
              <div className="submitbutton selectionitem">
                <Button block type="primary" onClick={handleSubmit}>
                <i className="fa fa-plus m-r-5" aria-hidden="true" />
                Submit
              </Button>
              </div>
            </div>
          </Layout.Sidebar>
          <Layout.Content>
            <QueueTable/>
          </Layout.Content>
        </Layout>
      </div>
    </div>
  );
};

routes.register(
  "Queue",
  routeWithUserSession({
    path: "/queue",
    title: "Queue",
    render: pageProps => <ProvideData {...pageProps} currentPage="all" />,
  })
);