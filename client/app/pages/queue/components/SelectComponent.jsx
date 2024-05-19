import React, { useEffect, useState } from 'react';
import Select from 'antd/lib/select';
import axios from 'axios';


import "./styles.css";

const SelectComponent = ({onChange}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { Option } = Select;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get('https://vs-proddash-dat.ad.vetter-group.de/api/objects');
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Select
      showSearch
      placeholder="Select Equipment"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      loading={loading}
      style={{width: 260}}
    >
      {options.map((opt) => (
        <Option key={opt.id} value={opt.id}>
          {opt.description}
        </Option>
      ))}
    </Select>
  );
};

export default SelectComponent;