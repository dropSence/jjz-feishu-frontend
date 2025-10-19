import "./App.css";

import { useState, useEffect } from "react";
import { bitable } from "@lark-base-open/connector-api";
import { Button, Form, Input, DatePicker } from "antd";
import moment from 'moment';

export default function App() {
    const [value, setValue] = useState("");
    const [userId, setUserId] = useState("");
    const [tenantKey, setTenantKey] = useState("");
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

    const handleSaveConfig = (config: any) => {
        const startDate = moment(config['config-item-1'][0]).format('YYYY-MM-DD');
        const endDate = moment(config['config-item-1'][1]).format('YYYY-MM-DD');
        console.log("startDate", {
            startDate,
            endDate,
            MATNAME: config['MATNAME'],
            MATID: config['MATID'],
        });
        bitable.saveConfigAndGoNext({
            startDate,
            endDate,
            MATNAME: config['MATNAME'],
            MATID: config['MATID'],
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
                    // 这里的属性名 "timeRange" 需要与下面 Form.Item 的 name 一致
                    "config-item-1": [moment().subtract(7, 'days'), moment()] // 设置默认时间范围为前七天至今
                }}
            >
                <Form.Item label="时间范围" name="config-item-1">
                    <RangePicker />
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
