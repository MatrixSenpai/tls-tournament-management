import type { FunctionComponent, ReactNode } from 'react'
import { Link } from 'react-router'

export interface SingleBlock {
    title: string
    items: SingleBlockItem[]
}
export interface SingleBlockItem {
    text: string
    badgeContent?: string
    badgeType?: string
    itemLink?: string
}

export interface SinglePageProps {
    pageTitle: string
    editLink: string
    blocks?: SingleBlock[]
    children?: ReactNode
}
export const SinglePage: FunctionComponent<SinglePageProps> = props => {
    return (
        <div className='d-grid row-gap-4'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-between'>
                    <h2>{props.pageTitle}</h2>

                    <div>
                        <Link to={props.editLink} className='btn btn-primary'>
                            <i className='bi bi-pencil me-2' />
                            Edit
                        </Link>
                    </div>
                </div>

                <div className='row row-gap-md-0 row-gap-4'>
                    {props.blocks?.map((block: SingleBlock, i: number) => (
                        <BlockComponent key={i} {...block} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const BlockComponent: FunctionComponent<SingleBlock> = props => {
    return (
        <div className='col-md-6 col-12'>
            <h4>{props.title}</h4>

            <div className='list-group'>
                {props.items.map((item: SingleBlockItem, i: number) => (
                    <BlockItem key={i} {...item} />
                ))}
            </div>
        </div>
    )
}

const BlockItem: FunctionComponent<SingleBlockItem> = props => {
    if (props.itemLink !== undefined) return <BlockItemLink {...props} />
    else return <BlockItemPlain {...props} />
}

const BlockItemPlain: FunctionComponent<Partial<SingleBlockItem>> = props => {
    const className = `list-group-item ${props.badgeContent && 'd-flex justify-content-between align-items-center'}`
    const badgeClassName = `badge rounded-pill text-bg-${props.badgeType ?? 'primary'}`
    return (
        <li className={className}>
            {props.text}

            {props.badgeContent && <span className={badgeClassName}>{props.badgeContent}</span>}
        </li>
    )
}

const BlockItemLink: FunctionComponent<Partial<SingleBlockItem>> = props => {
    const className = `list-group-item ${props.badgeContent && 'd-flex justify-content-between align-items-center'}`
    const badgeClassName = `badge rounded-pill text-bg-${props.badgeType ?? 'primary'}`
    return (
        <Link className={className} to={props.itemLink!}>
            {props.text}

            {props.badgeContent && <span className={badgeClassName}>{props.badgeContent}</span>}
        </Link>
    )
}
