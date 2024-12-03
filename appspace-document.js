{\rtf1\ansi\ansicpg1252\cocoartf2820
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Monaco;}
{\colortbl;\red255\green255\blue255;\red199\green200\blue201;\red226\green226\blue226;}
{\*\expandedcolortbl;;\cssrgb\c81961\c82353\c82745;\cssrgb\c90980\c90980\c90980\c3922;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 (function() \{\
    // Sample data structures\
\
    // var inputData = \{\
    //     id: '12345',\
    //     isEdit: false,\
    //     config: \{\
    //         input: '',\
    //     \}\
    // \}\
\
    // var configData = \{\
    //     id: '12345',\
    //     isEdit: true,\
    //     config: \{\
    //         input: \{\
    //             type: 'textarea',\
    //             placeholder: 'Enter your text here...',\
    //             default: '',\
    //         \}\
    //     \}\
    // \}\
\
    // var outputData = \{\
    //     id: '12345',\
    //     html: '',\
    //     error: \{\
    //         code: '',\
    //         message: '',\
    //     \}\
    // \}\
\
    // window.postMessage(\{ \
    //     message: "appspace.document.plugin.custom", \
    //     command: 'change', \
    //     data: \{\
    //         id: '12345',\
    //         isEdit: false,\
    //         config: \{\
    //             input: 'sequenceDiagram\\nA->> B: Query\\nB->> C: Forward query\\nNote right of C: HELLO AIM\\nC->> B: Responsecle\\nB->> A: Forward response',\
    //         \}\
    //     \} \
    // \}, \
    // "*");\
\
    var initId = crypto.randomUUID();\
    var initResolve = null;\
    function sendMessage(command, data) \{\
        window.parent.postMessage(\{ message: "appspace.document.plugin.custom", command: command, data: data \}, "*");\
    \}\
\
    function initialize(config) \{\
        return new Promise(function(resolve) \{\
            var onLoad = function() \{\
                window.removeEventListener("message", onMessage);\
                window.addEventListener("message", onMessage);\
                sendMessage("init", \{ id: initId, config: config\});\
                document.removeEventListener("DOMContentLoaded", onLoad);\
                initResolve = resolve;\
            \};\
\
            document.addEventListener("DOMContentLoaded", onLoad);\
        \});\
    \}\
\
    function update(input, html, errorMessage, errorCode) \{\
        if (!input) \{\
            console.error("Input is required!");\
            return;\
        \}\
\
        var data = \{\
            id: input.id,\
            html: html,\
        \};\
\
        if (errorMessage || errorCode) \{\
            data.error = \{\
                code: errorCode || "UnknownCode",\
                message: errorMessage || "Unknown error occurred!",\
            \};\
        \}\
\
        sendMessage("update", data);\
    \}\
\
    function onMessage(e) \{\
        e = e || \{\};\
        e.data = e.data || \{\};\
        if (e.data.message !== "appspace.document.plugin.custom") \{\
            return;\
        \}\
\
        var command = e.data.command || "";\
        var data = e.data.data || \{\};\
\
        switch (command) \{\
            case "change":\
                onDataChange(data);\
                break;\
            \
            case "init":\
                onInit(data);\
                break;\
            \
            case "update":\
                console.log("Update Sent!!!", data);\
                break;\
\
            default:\
                console.warn("Unknown command: ", e);\
                break;\
        \}\
    \};\
\
    function onInit(data) \{\
        if (!data || data.id !== initId) \{\
            console.error("Invalid init data received!");\
            return\
        \}\
\
        if (initResolve) \{\
            initResolve(data);\
        \}\
    \}\
\
    function onDataChange(data) \{\
        var plugin = window.appspaceDocumentPlugin || \{\};\
        var onChange = plugin.onChange;\
        if (onChange && typeof onChange === "function") \{\
            onChange(data);\
            return;\
        \}\
\
        console.warn("No change handler found!");\
    \}\
\
    window.appspaceDocumentPlugin = \{\
        initialize: initialize,\
        update: update,\
        onChange: function() \{\},\
    \};\
\})();}