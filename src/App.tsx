import "./App.css";
import { useState, useEffect } from "react";
import { bitable } from "@lark-base-open/connector-api";
import { Button, Form, Input, DatePicker, Radio } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";
export default function App() {
  const [value, setValue] = useState("");
  const [userId, setUserId] = useState("");
  const [tenantKey, setTenantKey] = useState("");
  const [tabseqValue, setTabseqValue] = useState(1);
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
      startDate: dayjs(config["startDate"]).format(dateFormat),
      endDate: dayjs(config["endDate"]).format(dateFormat),
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
          startDate: dayjs().subtract(7, "days"),
          endDate: dayjs(),
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
