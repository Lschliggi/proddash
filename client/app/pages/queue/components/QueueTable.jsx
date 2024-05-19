import React, { useEffect, useState } from "react";
import Table from "antd/lib/table";
import axios from "axios";
import { CloseOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import notification from "antd/lib/notification";
import Popconfirm from "antd/lib/popconfirm";

import 'antd/lib/notification/style/index.css';
import "./styles.css";

export default function QueueTable() {
 const [ queue, setQueue ] = useState([]);

 const openSuccessNotification = () => {
  notification.success({
    message: 'Success',
    placement: "bottomLeft",
    description: 'The queue has been successfully modified!',
    duration: 5, // Notification will hide after 5 seconds
  });
};

const openErrorNotification = (message) => {
  notification.error({
    message: 'Error',
    placement: "bottomLeft",
    description: message,
    duration: 5, // Notification will hide after 5 seconds
  });
};
useEffect(() => {
  const fetchdata = async () => {
      try {
          const response = await fetch('https://vs-proddash-dat.ad.vetter-group.de/api/queue');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setQueue(data);
      } catch (error) {
          openErrorNotification('An error occurred while fetching the data!');
      }
  }
  fetchdata();
}, []);


const handleDelete = async (key) => {
  try {
    await axios.delete(`https://vs-proddash-dat.ad.vetter-group.de/api/queue/id=${key}`);
    // Refresh the table data after successful deletion
    const response = await fetch('https://vs-proddash-dat.ad.vetter-group.de/api/queue');
    const data = await response.json();
    setQueue(data);
    openSuccessNotification();
  } catch (error) {
    openErrorNotification('Error deleting data:', error);
  }
};

const columns = [
  {
    title: 'Equipment',
    dataIndex: 'equipment',
    key: 'equipment',
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'Database Name',
    dataIndex: 'dbName',
    key: 'dbName',
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: 'Keep Updated',
    dataIndex: 'keepUpdated',
    key: 'keepUpdated',
    render: (keepUpdated) => (keepUpdated ? <CheckOutlined/> : <CloseOutlined/>),
  },
  {
    title: 'Edit',
    dataIndex: 'key',
    key: 'key',
    render: (key) => (
      <Popconfirm
      title="Are you sure to delete this item?"
      onConfirm={() => handleDelete(key)}
      okText="Yes"
      cancelText="No"
    >
      <button type="button" className="deletebutton">
        <DeleteOutlined />
        Delete
      </button>
    </Popconfirm>
    ),
  },
];
 
 return (
  <><div className="headinglabel">
     <h4>Currently available data:</h4>
   </div><div className="Table">
       <Table dataSource={queue} columns={columns} />
     </div></>
 );
}
