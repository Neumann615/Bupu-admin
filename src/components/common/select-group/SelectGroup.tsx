import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Input, Checkbox, Empty } from 'antd';
import { createStyles } from 'antd-style';
import { CloseCircleFilled, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import cx from 'classnames';
import Select from './image/select.png';

export interface BreadCrumb {
    title: string;
    key: string;
}
export interface Props {
    isOpen: boolean;
    title: string;
    width?: number;
    treeData: Record<string, any>[];
    handleClose: (value: React.MouseEvent<HTMLButtonElement>) => void;
}

const useStyles = createStyles(({ token, css }) => ({
    main: {
        width: '100%',
        display: "flex",
    },
    left: {
        width: '50%',
        borderRight: '1px solid rgb(217, 217, 217)',
    },
    right: {
        width: '50%',
    },
    leftInput: {
        width: '100%',
        marginBottom: '10px',
        padding: '0 10px',
    },
    topText: {
        width: '100%',
        display: 'inline-block',
        textAlign: 'center',
        lineHeight: '35px',
        fontSize: '17px',
        fontWeight: '600',
    },
    top: {
        display: 'flex',
        height: '35px',
        padding: '0 10px',
    },
    topBreadcrumb: {
        padding: '10px',
        display: 'flex',
        flexWrap: 'wrap',
    },
    breadcrumbTitle: css`
    cursor: pointer;
    color: rgba(23, 26, 29, 0.60);
    padding:3px;
    &:last-child {
        color: #333;
      }
    &:hover {
        background-color: rgba(127, 135, 144, 0.12);
      }
    `,
    tree: {
        height: '300px',
        overflow: 'auto',
        padding: '0 10px',
    },
    treeItem: {
        height: '48px',
        padding: '6px 4px 4px 0',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    treeCheckItem: {
        marginRight: '5px',
    },
    treeItemImg: {
        width: '36px',
        height: '36px',
        marginRight: '12px'
    },
    treeItemText: {
        flex: '1'
    },
    separate: {
        margin: '0 5px'
    },
    treeItemExtra: {
        fontSize: '12px',
        color: 'rgba(49,126,208,1)',
        lineHeight: '18px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid rgba(126,134,142,0.16)',
        cursor: 'pointer',
        opacity: '1',
        paddingLeft: '12px',
        marginLeft: '8px',
    },
    treeItemExtraCheck: {
        color: ' rgba(49, 126, 208, 0.2)',
        cursor: 'auto',
    },
    treeCheckAll: {
        padding: '0  10px',
    },
    checkItemGroup: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    checkItem: {
        display: "flex",
        backgroundColor: 'rgba(23, 26, 29, 0.03)',
        margin: "4px",
        borderRadius: '6px',
        height: '32px',
        padding: '0px 4px',
        alignItems: 'center',
    },
    checkItemImage: {
        width: '24px',
        height: '24px',
        marginRight: '5px'
    },
    checkItemValue: {
        marginRight: '8px'
    },
    empty: {
        width: '100%',
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
    },
    closeImg: {
        cursor: 'pointer',
        fontSize: '11px',
        color: 'rgba(0, 0, 0, 0.25)'
    }
}))

export interface BreadCrumbItem {
    title: string;
}

export default (props: Props) => {
    const { styles } = useStyles();
    const { title, isOpen, width, treeData } = props;
    const [breadCrumb, setBreadCrumb] = useState<BreadCrumb[]>([]);
    const [currentTree, setCurrentTree] = useState<Record<string, any>[]>([]);
    const [checkData, setCheckData] = useState<Record<string, any>>([]);
    useEffect(() => {
        setBreadCrumb([{
            title: treeData[0]?.name,
            key: treeData[0]?.id,
        }])
        const currentTreeTemp = getCurrentTreeData(treeData[0]);
        setCurrentTree(currentTreeTemp);
    }, [treeData]);

    const handleStep = (i: any) => {
        if (i.check) {
            return;
        }
        const breadCrumbTemp = breadCrumb.concat({
            title: i.name,
            key: i.id,
        })
        setBreadCrumb(breadCrumbTemp)
        const currentTreeTemp = getCurrentTreeData(i);
        setCurrentTree(currentTreeTemp)
    }

    const handleClickBread = (value: BreadCrumb) => {
        const index = breadCrumb.findIndex(item => item.key === value.key)
        const breadCrumbTemp = breadCrumb.slice(0, index + 1)
        setBreadCrumb(breadCrumbTemp)
        const breadDataTemp = searchListById(treeData, value.key);
        const currentTreeTemp = getCurrentTreeData(breadDataTemp[0]);
        setCurrentTree(currentTreeTemp)
    }

    const getCurrentTreeData = (data: Record<string, any>) => {
        return data?.children ? data.children.map((treeItem: Record<string, any>) => {
            const checkItem = checkData.find((i: Record<string, any>) => i.key === treeItem.id);
            return {
                ...treeItem,
                check: Boolean(checkItem || data.check),
            }
        }) : []
    }

    const searchListById: any = (treeData: Record<string, any>[], item: string) => {
        for (let i in treeData) {
            if (treeData[i].id === item) {
                return [treeData[i]]
            }
            else if (treeData[i].children) {
                return searchListById(treeData[i].children || [], item)
            }
        }
    }

    let checkAll = useMemo(() => {
        const data = currentTree.filter(i => !i.check)
        return data?.length ? false : true
    }, [currentTree])

    const handleCheckAll = (e: any) => {
        let currentTreeTemp: Record<string, any>[] = [];
        const checkDataTemp: Record<string, any>[] = JSON.parse(JSON.stringify(checkData));
        currentTree.forEach(i => {
            currentTreeTemp.push({
                ...i,
                check: e.target.checked
            })
            if (e.target.checked) {
                checkDataTemp.push({
                    key: i.id,
                    value: i.name
                })
            }
            else {
                const indexTemp = checkDataTemp.findIndex(item => item.key === i.id)
                indexTemp !== -1 && checkDataTemp.splice(indexTemp, 1)
            }
        })
        let uniqueArray = Array.from(new Set(checkDataTemp.map(obj => obj.key))).map(id => checkDataTemp.find(obj => obj.key === id));
        setCurrentTree(currentTreeTemp);
        setCheckData(uniqueArray)
    }

    const handleCheck = (value: Record<string, any>) => {
        const currentTreeTemp = currentTree.map(i => {
            const check = i.id === value.id ? !i.check : i.check
            return {
                ...i,
                check,
            }
        })
        setCurrentTree(currentTreeTemp);
        let checkDataTemp = JSON.parse(JSON.stringify(checkData))
        if (!value.check) {
            checkDataTemp = checkData.concat({
                key: value.id,
                value: value.name
            })
        }
        else {
            const indexTemp = checkDataTemp.findIndex((i: Record<string, any>) => i.key === value.id)
            checkDataTemp.splice(indexTemp, 1)
        }
        setCheckData(checkDataTemp)
    }

    const handleClickImg = (value: Record<string, any>) => {
        console.log(value, 'img');
        const checkDataTemp = JSON.parse(JSON.stringify(checkData))
        const indexTemp = checkDataTemp.findIndex((item: Record<string, any>) => item.key === value.key)
        indexTemp !== -1 && checkDataTemp.splice(indexTemp, 1);
        setCheckData(checkDataTemp)
        const currentTreeTemp = currentTree.map(i => {
            const checkTemp = checkDataTemp.find(item => item.key === i.id) ? true : false;
            return {
                ...i,
                check: checkTemp
            }
        })
        setCurrentTree(currentTreeTemp);
    }

    return <Modal title={title} open={isOpen} width={width || 800} onCancel={props.handleClose}>
        <div className={styles.main}>
            <div className={styles.left}>
                <div className={styles.leftInput}>
                    <Input
                        placeholder="搜索"
                        prefix={<SearchOutlined />}
                    />
                </div>
                <div className={styles.topBreadcrumb}>
                    {
                        breadCrumb.map((i, index) => {
                            return <div onClick={() => {
                                handleClickBread(i)
                            }}>{index === (breadCrumb?.length - 1) ?
                                i.title : <><span className={styles.breadcrumbTitle}>{i.title}</span><span className={styles.separate}>{'>'}</span></>
                                }</div>
                        })
                    }
                    {/* <Breadcrumb
                        separator=">"
                        items={breadCrumb}
                    /> */}
                </div>
                {currentTree?.length ? <Checkbox className={styles.treeCheckAll} checked={checkAll} onChange={handleCheckAll}>
                    全选
                </Checkbox> : null}
                <div className={styles.tree}>
                    {
                        currentTree?.length ? currentTree.map(i => {
                            return <div key={i.id} className={styles.treeItem}>
                                <Checkbox className={styles.treeCheckItem} checked={i.check} onChange={() => { handleCheck(i) }} />
                                <img src={Select} className={styles.treeItemImg} />
                                <div className={styles.treeItemText}>
                                    {i?.children?.length ? `${i.name}(${i?.children?.length})` : ` ${i.name}`}
                                </div>
                                <div
                                    className={cx(styles.treeItemExtra, { [styles.treeItemExtraCheck]: i.check })}
                                    onClick={() => {
                                        handleStep(i)
                                    }}>下级</div>
                            </div>
                        }) : <div className={styles.empty}>
                            <Empty />
                        </div>
                    }
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.top}>
                    <span>{`已选择${1}/1000`}</span>
                </div>
                <div className={styles.checkItemGroup}>
                    {
                        checkData.map((i: Record<string, any>) => {
                            return <div className={styles.checkItem} key={i.key}>
                                <img className={styles.checkItemImage} src={Select} />
                                <span className={styles.checkItemValue}>{i.value}</span>
                                <CloseCircleFilled className={styles.closeImg} onClick={() => { handleClickImg(i) }} />
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </Modal>
}