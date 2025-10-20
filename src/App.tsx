import "./App.css";

import { useState, useEffect } from "react";
import { bitable } from "@lark-base-open/connector-api";
import { Button, Form, Input, DatePicker, Radio } from "antd";
import moment from "moment";

export default function App() {
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState("");
  const [tenantKey, setTenantKey] = useState("");
  const [tabseqValue, setTabseqValue] = useState(1);
  const { RangePicker } = DatePicker;

  useEffect(() => {
    bitable.getConfig().then((config) => {
      console.log("pre sync config", config);
      setValue(config?.value || "");
    });
    bitable.getUserId().then((id) => {
      console.log("userId", id);
      setUserId(id);
    });
    bitable.getTenantKey().then((key) => {
      console.log("tenantKey", key);
      setTenantKey(key);
    });
  }, []);
  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  const handleSaveConfig = (config: any) => {
    console.log("startDate", {
      startDate: moment(config["startDate"]).format("YYYY-MM-DD"),
      endDate: moment(config["endDate"]).format("YYYY-MM-DD"),
      MATNAME: config["MATNAME"],
      MATID: config["MATID"],
      p_tabseq: config["p_tabseq"],
    });
    bitable.saveConfigAndGoNext({
      startDate: moment(config["startDate"]).format("YYYY-MM-DD"),
      endDate: moment(config["endDate"]).format("YYYY-MM-DD"),
      MATNAME: config["MATNAME"],
      MATID: config["MATID"],
      p_tabseq: config["p_tabseq"],
    });
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleSaveConfig}
        autoComplete="off"
        initialValues={{
          remember: true,
          startDate: moment().subtract(7, "days"), // 修正：直接使用moment对象，而非格式化后的字符串
          endDate: moment(), // 修正：直接使用moment对象
          p_tabseq: tabseqValue,
        }}
      >
        <Form.Item label="起始时间" name="startDate">
          <DatePicker />
        </Form.Item>
        <Form.Item label="结束时间" name="endDate">
          <DatePicker />
        </Form.Item>
        <Form.Item label="类型" name="p_tabseq">
          <Radio.Group
            value={tabseqValue}
            onChange={onChange}
            options={[
              { value: 1, label: "推商品" },
              { value: 3, label: "推直播间" },
              { value: 4, label: "汇总" },
            ]}
          />
        </Form.Item>
        <Form.Item label="视频名称" name="MATNAME">
          <Input />
        </Form.Item>
        <Form.Item label="素材ID" name="MATID">
          <Input />
        </Form.Item>
        <Form.Item label="">
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
