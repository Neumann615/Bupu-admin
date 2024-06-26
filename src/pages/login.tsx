import React, { useEffect, useState } from 'react'
import { message, Button, Checkbox, Dropdown, Form, Input, MenuProps, Tabs, Typography } from 'antd'
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    FontColorsOutlined,
    LockOutlined,
    PhoneOutlined,
    UserOutlined
} from '@ant-design/icons'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useNavigate } from "react-router"
import SliderCaptch from 'rc-slider-captcha';
import { login } from '@/api/index'
import { useMenuStore } from "@/store";
import { menuData } from "@/utils";
import { createStyles } from "antd-style";

const { Link } = Typography
const MainStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundImage: 'url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg)',
    paddingTop: '160px'
}
const TitleImgStyle = {
    width: "44px",
    height: '44px',
    marginRight: '16px'
}
const TitleStyle = {
    display: "flex",
    justifyContent: 'center',
    marginBottom: "16px"
}
const TitleTextStyle: React.CSSProperties = {
    position: 'relative',
    top: '2px',
    color: 'rgba(0,0,0,.85)',
    fontWeight: '600',
    fontSize: '33px'
}
const ContentStyle: React.CSSProperties = {
    width: '350px',
    display: 'flex',
    flexDirection: 'column',
}
const BottomStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: "border-box",
    padding: "16px 0px 20px 0px"
}
const PassWordStyle = {
    display: 'flex'
}
const PassWordValidStyle = {
    marginRight: '10px'
}
const LanguageStyle: React.CSSProperties = {
    position: "absolute",
    top: '20px',
    right: "20px"
}
const TitleContentStyle = {
    marginTop: '12px',
    marginBottom: '40px',
    color: 'rgba(0,0,0,.45)',
    fontSize: '14px',
}
const items = [
    {
        label: '中文简体',
        key: '1',
    },
    {
        label: '繁体中文',
        key: '2',
    },
    {
        label: '英文',
        key: '3',
    },
    {
        label: '缅甸文',
        key: '4',
    },
    {
        label: '越南文',
        key: '5',
    },
];

const useStyles = createStyles(({ token, css }) => ({
    customSlider: {
        "--rcsc-primary": token["blue-5"],
        "--rcsc-primary-light": token['blue-2'],
        "--rcsc-error": token["red-5"],
        "--rcsc-error-light": token['red-2'],
        "--rcsc-success": token["purple-5"],
        "--rcsc-success-light": token['purple-2']
    }
}))

export default function Login() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([items[0].key]);
    const [activeTab, setActiveTab] = useState<string>('1');
    const { styles, theme } = useStyles()
    const initData = JSON.parse(window.localStorage.getItem("remeber")!)
    const [form] = Form.useForm();
    const navigate = useNavigate()
    useEffect(() => {
        if (initData) {
            onFinish()
        }
    }, [])
    const renderUserLogin = () => {
        return <div style={ContentStyle}>
            <Form
                size="large"
                name="basic"
                form={form}
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 600 }}
                initialValues={initData}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off">
                <Form.Item
                    name="userName"
                    rules={[{ required: true, message: '请输入用户名!' }]}>
                    <Input
                        size="large"
                        placeholder="请输入用户名"
                        allowClear
                        prefix={<UserOutlined />}
                    />
                </Form.Item>
                <Form.Item
                    name="userId"
                    rules={[{ required: true, message: '请输入密码!' }]}>
                    <Input.Password
                        size="large"
                        placeholder="请输入密码"
                        prefix={<LockOutlined />}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
                <SliderCaptch
                    bgSize={{ width: 350 }}
                    mode="slider"
                    className={styles.customSlider}
                    tipText={{
                        default: '请按住滑块，拖动到最右边',
                        moving: '请按住滑块，拖动到最右边',
                        error: '验证失败，请重新操作',
                        success: '验证成功'
                    }}
                    errorHoldDuration={1000}
                    onVerify={(data) => {
                        console.log(data, 'data');
                        // 默认背景图宽度 320 减去默认拼图宽度 60 所以滑轨宽度是 260
                        if (data.x === 290) {
                            return Promise.resolve();
                        }
                        return Promise.reject();
                    }}
                />
                {renderFooter()}
            </Form>

        </div>
    }

    const renderFooter = () => {
        return <>
            <div style={BottomStyle}>
                <Checkbox onChange={changeBox}>自动登录</Checkbox>
                <Link>
                    忘记密码?
                </Link>
            </div>
            <Form.Item>
                <Button htmlType="submit" style={{ width: "100%" }}
                    // onClick={() => {
                    //     window.localStorage.setItem("token", "zym-LOGIN-HAHHA")
                    //     setTimeout(() => {
                    //         navigate("/")
                    //     }, 300)
                    // }} 
                    type='primary' size="large">登录</Button>
            </Form.Item>
        </>
    }
    const changeBox = (e: CheckboxChangeEvent) => {
        console.log(`checked = ${e.target.checked}`);
    }
    const onFinish = async () => {
        window.localStorage.setItem("token", "zym-LOGIN-HAHHA")
        useMenuStore.setState({
            mainNavData: menuData,
            // asideBarSelection: menuData[0].id,
            menuData: menuData[0].children,
            // menuDataSelection: "/"
        })
        setTimeout(() => {
            navigate("/")
        }, 300)
        // window.localStorage.setItem("token", result.token);
        // navigate("/")
        // const { autoLogin, userName, userId } = form.getFieldsValue();
        // console.log(autoLogin, 'autoLogin')
        // const loginParams = {
        //     userName,
        //     userId
        // }
        // try {
        //     const result = await login(loginParams);
        //     if (result.resultCode === '1') {
        //         if (autoLogin) {
        //             window.localStorage.setItem("remeber", JSON.stringify({ autoLogin, userName, userId }));
        //         }
        //         window.localStorage.setItem("token", result.token);
        //         navigate("/")
        //         return
        //     }
        //     message.error(result?.message && '登录失败');
        // }
        // catch (e) {
        //     message.error('登录异常')
        // }

        // console.log(resultData, 'resultData')
    }

    const onFinishFailed = () => {

    }
    const renderphoneLogin = () => {
        return <div style={ContentStyle}>
            <Form
                size="large"
                name="basic"
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入手机号!' }]}
                >
                    <Input
                        size="large"
                        placeholder="请输入手机号"
                        allowClear
                        prefix={<PhoneOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入验证码!' }]}
                >
                    <div style={PassWordStyle}>
                        <Input
                            size="large"
                            placeholder="请输入验证码"
                            prefix={<LockOutlined />}
                            style={PassWordValidStyle}
                        />
                        <Button size="large">
                            获取验证码
                        </Button>
                    </div>

                </Form.Item>
            </Form>
            {
                renderFooter()
            }
        </div>
    }

    const loginContentItems = [
        {
            label: '账户密码登录',
            key: '1',
            children: renderUserLogin()
        },
        {
            label: '手机号登录',
            key: '2',
            children: renderphoneLogin(),
        },
    ]

    const onClick: MenuProps['onClick'] = (item) => {
        setSelectedKeys([item.key])
    };
    const handleTabs = (key: string) => {
        setActiveTab(key)
    }

    return <div style={MainStyle}>
        <div>
            <div style={TitleStyle}>
                <img src="/images/vite.svg" style={TitleImgStyle} />
                <div style={TitleTextStyle}>Bupu后台管理系统</div>
            </div>
        </div>
        <Tabs activeKey={activeTab} items={loginContentItems} onChange={handleTabs} centered />
    </div>
}