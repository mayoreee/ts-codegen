import * as t from '@babel/types';
import { camel } from 'case';
import {
    bindMethod,
    typedIdentifier,
    classDeclaration,
    classProperty,
    arrowFunctionExpression,
    getMessageProperties
} from '../utils'
import { ExecuteMsg } from '../types';
import { createTypedObjectParams } from '../utils/types';
import { JSONSchema } from '../types';
import { RenderContext } from '../context';
import { identifier } from '../utils/babel';
import { getWasmMethodArgs } from '../client/client';

const createWasmExecMethodMessageComposer = (
    context: RenderContext,
    jsonschema: any
) => {

    context.addUtil('Coins');
    context.addUtil('MsgExecuteContractEncodeObject');
    context.addUtil('MsgExecuteContract');
    context.addUtil('toUtf8');

    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const obj = createTypedObjectParams(context, jsonschema.properties[underscoreName]);
    const args = getWasmMethodArgs(
        context,
        jsonschema.properties[underscoreName]
    );

    const constantParams = [
        identifier('funds', t.tsTypeAnnotation(
            t.tsArrayType(
                t.tsTypeReference(
                    t.identifier('Coins')
                )
            )
        ), true)
    ];

    return t.classProperty(
        t.identifier(methodName),
        arrowFunctionExpression(
            obj ? [
                // props
                obj,
                ...constantParams
            ] : constantParams,
            t.blockStatement(
                [
                    t.returnStatement(

                        t.objectExpression([
                            t.objectProperty(
                                t.identifier('typeUrl'),
                                t.stringLiteral('/cosmwasm.wasm.v1.MsgExecuteContract')
                            ),
                            t.objectProperty(
                                t.identifier('value'),
                                t.callExpression(
                                    t.memberExpression(
                                        t.identifier('MsgExecuteContract'),
                                        t.identifier('fromPartial')
                                    ),
                                    [
                                        t.objectExpression([
                                            t.objectProperty(
                                                t.identifier('sender'),
                                                t.memberExpression(
                                                    t.thisExpression(),
                                                    t.identifier('sender')
                                                )
                                            ),
                                            t.objectProperty(
                                                t.identifier('contract'),
                                                t.memberExpression(
                                                    t.thisExpression(),
                                                    t.identifier('contractAddress')
                                                )
                                            ),
                                            t.objectProperty(
                                                t.identifier('msg'),
                                                t.callExpression(
                                                    t.identifier('toUtf8'),
                                                    [
                                                        t.callExpression(
                                                            t.memberExpression(
                                                                t.identifier('JSON'),
                                                                t.identifier('stringify')
                                                            ),
                                                            [
                                                                t.objectExpression(

                                                                    [
                                                                        t.objectProperty(
                                                                            t.identifier(underscoreName), t.objectExpression(args)
                                                                        )
                                                                    ]

                                                                )
                                                            ]
                                                        )
                                                    ]
                                                )
                                            ),
                                            t.objectProperty(
                                                t.identifier('funds'),
                                                t.identifier('funds'),
                                                false,
                                                true
                                            ),
                                        ])
                                    ]
                                )
                            )
                        ])
                    )
                ]
            ),
            // return type
            t.tsTypeAnnotation(
                t.tsTypeReference(
                    t.identifier('MsgExecuteContractEncodeObject')
                )
            ),
            false
        )
    );

}

export const createMessageComposerClass = (
    context: RenderContext,
    className: string,
    implementsClassName: string,
    execMsg: ExecuteMsg
) => {

    const propertyNames = getMessageProperties(execMsg)
        .map(method => Object.keys(method.properties)?.[0])
        .filter(Boolean);

    const bindings = propertyNames
        .map(camel)
        .map(bindMethod);

    const methods = getMessageProperties(execMsg)
        .map(schema => {
            return createWasmExecMethodMessageComposer(context, schema)
        });

    const blockStmt = [];

    [].push.apply(blockStmt, [
        t.expressionStatement(
            t.assignmentExpression(
                '=',
                t.memberExpression(
                    t.thisExpression(),
                    t.identifier('sender')
                ),
                t.identifier('sender')
            )
        ),
        t.expressionStatement(
            t.assignmentExpression(
                '=',
                t.memberExpression(
                    t.thisExpression(),
                    t.identifier('contractAddress')
                ),
                t.identifier('contractAddress')
            )
        ),
        ...bindings
    ]);

    return t.exportNamedDeclaration(
        classDeclaration(className,
            [
                // sender
                classProperty('sender', t.tsTypeAnnotation(
                    t.tsStringKeyword()
                )),

                // contractAddress
                classProperty('contractAddress', t.tsTypeAnnotation(
                    t.tsStringKeyword()
                )),

                // constructor
                t.classMethod('constructor',
                    t.identifier('constructor'),
                    [
                        typedIdentifier('sender', t.tsTypeAnnotation(t.tsStringKeyword())),
                        typedIdentifier('contractAddress', t.tsTypeAnnotation(t.tsStringKeyword()))
                    ],
                    t.blockStatement(
                        blockStmt
                    )),
                ...methods
            ],
            [
                t.tSExpressionWithTypeArguments(
                    t.identifier(implementsClassName)
                )
            ],
            null
        )
    );
}

export const createMessageComposerInterface = (
    context: RenderContext,
    className: string,
    execMsg: ExecuteMsg
) => {

    const methods = getMessageProperties(execMsg)
        .map(jsonschema => {
            const underscoreName = Object.keys(jsonschema.properties)[0];
            const methodName = camel(underscoreName);
            return createPropertyFunctionWithObjectParamsForMessageComposer(
                context,
                methodName,
                'MsgExecuteContractEncodeObject',
                jsonschema.properties[underscoreName]
            );
        });

    const extendsAst = [];

    return t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
            t.identifier(className),
            null,
            extendsAst,
            t.tSInterfaceBody(
                [

                    // contract address
                    t.tSPropertySignature(
                        t.identifier('contractAddress'),
                        t.tsTypeAnnotation(
                            t.tsStringKeyword()
                        )
                    ),

                    // contract address
                    t.tSPropertySignature(
                        t.identifier('sender'),
                        t.tsTypeAnnotation(
                            t.tsStringKeyword()
                        )
                    ),

                    ...methods,
                ]
            )
        )
    );
};

const createPropertyFunctionWithObjectParamsForMessageComposer = (
    context: RenderContext,
    methodName: string,
    responseType: string,
    jsonschema: JSONSchema
) => {
    const obj = createTypedObjectParams(context, jsonschema);
    const fixedParams = [
        identifier('funds', t.tsTypeAnnotation(
            t.tsArrayType(
                t.tsTypeReference(
                    t.identifier('Coins')
                )
            )
        ), true)
    ];
    const func = {
        type: 'TSFunctionType',
        typeAnnotation: t.tsTypeAnnotation(t.tsTypeReference(
            t.identifier(responseType)
        )),
        parameters: obj ? [
            obj,
            ...fixedParams

        ] : fixedParams
    }

    return t.tSPropertySignature(
        t.identifier(methodName),
        t.tsTypeAnnotation(
            // @ts-ignore:next-line
            func
        )
    );
};

