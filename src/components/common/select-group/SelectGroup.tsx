import React, { useEffect, useState } from 'react';
import { Modal, Input, Breadcrumb } from 'antd';
import { createStyles } from 'antd-style';
import { LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb';
import Select from './image/select.png';

export interface Props {
    isOpen: boolean;
    title: string;
    width?: number;
    treeData: Record<string, any>[];
}

const useStyles = createStyles(({ token }) => ({
    main: {
        width: '100%',
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
        padding:'0 10px',
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
        padding:'0 10px',
    },
    topBreadcrumb: {
        padding:'10px',
    },
    tree: {
        height: '300px',
        overflow: 'auto',
        padding:'0 10px',
    },
    treeItem: {
        height: '48px',
        padding: '6px 4px 4px 8px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    treeItemImg: {
        width: '36px',
        height: '36px',
        marginRight: '12px'
    },
    treeItemText: {
        flex: '1'
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
    }
}))

export interface BreadCrumbItem {
    title: string;
}

export default (props: Props) => {
    const { styles } = useStyles();
    const { title, isOpen, width, treeData } = props;
    const [breadCrumb, setBreadCrumb] = useState<any[]>([]);
    const [currentTree, setCurrentTree] = useState<Record<string, any>[]>([])
    useEffect(() => {
        setBreadCrumb([{
            title: treeData[0]?.name,
            onClick:handleBreadCrumb
        }])
        setCurrentTree(treeData[0]?.children || []);
    }, [treeData]);

    const handleBreadCrumb = (e) => {
        console.log(e,'e')
    }

    const handleStep = (i:any) => {
        const breadCrumbTemp = breadCrumb.concat({
            title:i.name
        })
        setBreadCrumb(breadCrumbTemp)
        setCurrentTree(i?.children || [])
    }

    return <Modal title={title} open={isOpen} width={width || 800}>
        <div className={styles.main}>
            <div className={styles.left}>
                <div className={styles.leftInput}>
                    <Input
                        placeholder="搜索"
                        prefix={<SearchOutlined />}
                    />
                </div>
                <div className={styles.topBreadcrumb}>
                    <Breadcrumb
                        separator=">"
                        items={breadCrumb}
                    />
                </div>
                <div className={styles.tree}>
                    {
                        currentTree.map(i => {
                            return <div key={i.id} className={styles.treeItem}>
                                <img src={Select} className={styles.treeItemImg} />
                                <div className={styles.treeItemText}>
                                    {i?.children?.length ? `${i.name}(${i?.children?.length})` : ` ${i.name}`}
                                </div>
                                <div className={styles.treeItemExtra} onClick={() => {
                                    handleStep(i)
                                }}>下级</div>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className={styles.right}></div>
        </div>
    </Modal>
}