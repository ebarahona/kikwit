'use strict';

import http from 'http';
import path from 'path';
import url from 'url';

import * as results from '../lib/actionResults';
import * as helpers from './support/helpers'

import Context from '../lib/context';

beforeEach(function(){
    jasmine.addMatchers(helpers.customMatchers);
});

describe('context', () => {
    
    describe('constructor', () => {
      
        it('should set config', () => {
            
            const config = { a: Math.random(), b: Math.random() };
            const request = { url: '/controller/action' };
            
            const ctx = new Context(config, [], request, {});
            
            expect(ctx.config).toEqual(config);
        });
        it('should set routes', () => {
            
            const routes = [ { a: Math.random() }, { b: Math.random() } ];
            const request = { url: 'controller/action' };
            
            const ctx = new Context({}, routes, request, {});
            
            expect(ctx.routes).toEqual(routes);
        });            
        it('should set request', () => {
            
            const request = { url: '/controller/action' };
            
            const ctx = new Context({}, [], request, {});
            
            expect(ctx.request).toEqual(request);
        });
        it('should set response', () => {
            
            const request = { url: '/controller/action' };
            const response = { a: Math.random(), b: Math.random() };
            
            const ctx = new Context({}, [], request, response);
            
            expect(ctx.response).toEqual(response);
        }); 
        it('should set state', () => {
            
            const request = { url: '/controller/action' };
            
            const ctx = new Context({}, [], request, {});
            
            expect(ctx.state).toEqual({});
        });
        it('should set pathname', () => {
            
            const request = { url: '/controller/action?dd=gjhkh&df=sgrsjg' };
                    
            const ctx = new Context({}, [], request, {});

            expect(ctx.pathname).toEqual('/controller/action');
        });
        it('should set query', () => {
            
            let query = {
                a: Math.random(),
                b: Math.random(),
                c: Math.random()
            };
            
            const request = { url: `/controller/action?a=${query.a}&b=${query.b}&c=${query.c}` };
            const pathname = path.normalize(decodeURI(url.parse(request.url).pathname));
                    
            const ctx = new Context({}, [], request, {});

            expect(ctx.query).toDeepEqual(query);
        });  
        it('should set search', () => {
                 
            const request = { url: '/controller/action?a=$kgyhf&b=lhjgh&c=kyjj' };
                    
            const ctx = new Context({}, [], request, {});

            expect(ctx.search).toEqual('?a=$kgyhf&b=lhjgh&c=kyjj');
        });      
        it('should set href', () => {
                   
            const request = { url: '/controller/action?a=kjgg&b=$sff&c=hjfhf' };
                    
            const ctx = new Context({}, [], request, {});

            expect(ctx.href).toEqual(request.url);
        }); 
        it('should set path', () => {
                   
            const request = { url: '/controller/action?a=kjgg&b=$sff&c=hjfhf' };
                    
            const ctx = new Context({}, [], request, {});

            expect(ctx.path).toEqual('/controller/action?a=kjgg&b=$sff&c=hjfhf');
        });                                     
    });  
    
    describe('get cookies()', () => {
        
        it('should not set cookies when cookieParser is not set', () => {
           
            const cookies = {
                a: Math.random().toString(),
                c: Math.random().toString(),
                b: Math.random().toString()
            }           

            const config = { cookieParser: undefined };
            
            const request = { 
                url: '/controller/action',
                method: 'get',
                headers: {
                    'cookie': `a=${cookies.a}; b=${cookies.b}; c=${cookies.c}`
                } 
            };
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.cookies).toEqual({});            
        });
        it('should set cookies when cookieParser is set', () => {
           
            const cookies = {
                a: Math.random().toString(),
                c: Math.random().toString(),
                b: Math.random().toString()
            }           

            const config = { cookieParser: {} };
            
            const request = { 
                url: '/controller/action',
                method: 'get',
                headers: {
                    'cookie': `a=${cookies.a}; b=${cookies.b}; c=${cookies.c}`
                } 
            };
                    
            const ctx = new Context(config, [], request, {});

            Object.keys(cookies).forEach(x => {
                expect(ctx.cookies.get(x)).toEqual(cookies[x]); 
            });           
        });        
    }); 
    
    describe('get host()', () => {
        
        it('should return the correct value when trusting proxy and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: true
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.proxied-host.com:3000');
        });
        it('should return the correct value when not trusting proxy (false) and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: false
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.site.com:3000');
        }); 
        it('should return the correct value when not trusting proxy (falsy) and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: ''
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.site.com:3000');
        }); 
        it('should return the correct value when not trusting proxy (undefined) and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: undefined
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.site.com:3000');
        });
        it('should return the correct value when trusting proxy and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com',
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: true
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.proxied-host.com:80');
        }); 
        it('should return the correct value when not trusting proxy (false) and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com',
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: false
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.site.com:3000');
        });
        it('should return the correct value when not trusting proxy (falsy) and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com',
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: ''
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.site.com:3000');
        }); 
        it('should return the correct value when not trusting proxy (undefined) and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com',
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                },
                trustProxy: undefined
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.site.com:3000');
        });                                                                
        it('should return the correct value', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com'
                }
            };
            
            const config = {
                server: {
                    port: 3000
                }
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.host).toEqual('www.site.com:3000');
        });  
    });
    
    
    describe('get hostname()', () => {
        
        it('should return the correct value when trusting proxy and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                trustProxy: true
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.hostname).toEqual('www.proxied-host.com');
        });
        it('should return the correct value when not trusting proxy (false) and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                trustProxy: false
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.hostname).toEqual('www.site.com');
        }); 
        it('should return the correct value when not trusting proxy (falsy) and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                trustProxy: ''
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.hostname).toEqual('www.site.com');
        }); 
        it('should return the correct value when not trusting proxy (undefined) and x-forwarded-host', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'www.site.com',
                    ['x-forwarded-host']: 'www.proxied-host.com'
                }
            };
            
            const config = {
                trustProxy: undefined
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.hostname).toEqual('www.site.com');
        });  
    });
    
    describe('get ip()', () => {
        
        it('should return the correct value when trusting proxy and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                }
            };
            
            const config = {
                trustProxy: true
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ip).toEqual('1.2.3.4');
        });
        it('should return the correct value when not trusting proxy (false) and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                },
                connection: {
                    remoteAddress: '1.2.3.4'
                }
            };
            
            const config = {
                trustProxy: false
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ip).toEqual(request.connection.remoteAddress);
        });
        it('should return the correct value when not trusting proxy (falsy) and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                },
                connection: {
                    remoteAddress: '1.2.3.4'
                }
            };
            
            const config = {
                trustProxy: ''
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ip).toEqual(request.connection.remoteAddress);
        });  
        it('should return the correct value when not trusting proxy (undefined) and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                },
                connection: {
                    remoteAddress: '1.2.3.4'
                }
            };
            
            const config = {
                trustProxy: undefined
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ip).toEqual(request.connection.remoteAddress);
        });                      
    });    
    
    describe('get ips()', () => {
        
        it('should return the correct value when trusting proxy and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                }
            };
            
            const config = {
                trustProxy: true
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ips).toEqual(['1.2.3.4','5.6.7.8','9.1.2.3','4.5.6.7']);
        });
        it('should return the correct value when not trusting proxy (false) and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                },
                connection: {
                    remoteAddress: '1.2.3.4'
                }
            };
            
            const config = {
                trustProxy: false
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ips).toEqual([request.connection.remoteAddress]);
        });
        it('should return the correct value when not trusting proxy (falsy) and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                },
                connection: {
                    remoteAddress: '1.2.3.4'
                }
            };
            
            const config = {
                trustProxy: ''
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ips).toEqual([request.connection.remoteAddress]);
        });  
        it('should return the correct value when not trusting proxy (undefined) and x-forwarded-for', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-for']: '1.2.3.4,5.6.7.8,9.1.2.3,4.5.6.7'
                },
                connection: {
                    remoteAddress: '1.2.3.4'
                }
            };
            
            const config = {
                trustProxy: undefined
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.ips).toEqual([request.connection.remoteAddress]);
        });                      
    });    
    
    describe('get port()', () => {
        
        it('should return the correct value when trusting proxy and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                trustProxy: true,
                server: {
                    port: 3000
                }                
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.port).toEqual(80);
        });
        it('should return the correct value when trusting proxy (false) and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                trustProxy: false,
                server: {
                    port: 3000
                }                
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.port).toEqual(config.server.port);
        });
        it('should return the correct value when trusting proxy (falsy) and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                trustProxy: '',
                server: {
                    port: 3000
                }                
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.port).toEqual(config.server.port);
        });
        it('should return the correct value when trusting proxy (undefined) and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-port']: '80'
                }
            };
            
            const config = {
                trustProxy: undefined,
                server: {
                    port: 3000
                }                
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.port).toEqual(config.server.port);
        });                    
    });
    
    describe('get protocol()', () => {
        
        it('should return the correct value (https) when trusting proxy and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-proto']: 'https'
                }
            };
            
            const config = {
                trustProxy: true               
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.protocol).toEqual('https');
        });
        it('should return the correct value (http) when trusting proxy and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-proto']: 'http'
                }
            };
            
            const config = {
                trustProxy: true               
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.protocol).toEqual('http');
        });
        it('should return the correct value when connection encrypted and not trusting (false) proxy and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-proto']: 'https'
                },
                connection: {
                    encrypted: true
                }
            };
            
            const config = {
                trustProxy: false               
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.protocol).toEqual('https');
        }); 
        it('should return the correct value when connection not encrypted and not trusting (false) proxy and x-forwarded-port', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : {
                    ['x-forwarded-proto']: 'https'
                },
                connection: {
                    encrypted: false
                }
            };
            
            const config = {
                trustProxy: false               
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.protocol).toEqual('http');
        });
        it('should return the correct value when connection encrypted and not trusting (false) proxy', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : { },
                connection: {
                    encrypted: true
                }
            };
            
            const config = {
                trustProxy: false               
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.protocol).toEqual('https');
        }); 
        it('should return the correct value when connection not encrypted and not trusting (false) proxy', () => {
                   
            const request = { 
                url: '/controller/action',
                headers : { },
                connection: {
                    encrypted: false
                }
            };
            
            const config = {
                trustProxy: false               
            }
                    
            const ctx = new Context(config, [], request, {});

            expect(ctx.protocol).toEqual('http');
        });                          
    });
    
    describe('get subdomains()', () => {
        
        it('should return an empty array when accessing by ipv4', () => {
            
            const request = { 
                url: '/controller/action',
                headers : {
                    host: '192.169.10.04'
                }
            };
    
            const ctx = new Context({}, [], request, {});

            expect(ctx.subdomains).toEqual([]);                    
        });
        it('should return an empty array when accessing by ipv6', () => {
            
            const request = { 
                url: '/controller/action',
                headers : { }
            };
            
            const hosts = [
                '1050:0000:0000:0000:0005:0600:300c:326b',
                '1050:0:0:0:5:600:300c:326b',
                '0:0:0:0:0:ffff:192.1.56.10'
            ];
    
            let ctx;
            
            for (let host of hosts) {
                
                request.headers.host = host;
                
                ctx = new Context({}, [], request, {});

                expect(ctx.subdomains).toEqual([]);                
            }                    
        });
        it('should return an empty array when accessing by ipv4', () => {
            
            const request = { 
                url: '/controller/action',
                headers : {
                    host: 'sub1.sub2.sub3.example.com'
                }
            };
            
            const config = { };
            
            const sample = [
                {
                    subdomainOffset: 0,
                    expected: ['com', 'example', 'sub3', 'sub2', 'sub1']
                },                
                {
                    subdomainOffset: 1,
                    expected: ['example', 'sub3', 'sub2', 'sub1']
                },
                {
                    subdomainOffset: 2,
                    expected: ['sub3', 'sub2', 'sub1']
                },
                {
                    subdomainOffset: 3,
                    expected: ['sub2', 'sub1']
                },
                {
                    subdomainOffset: 4,
                    expected: ['sub1']
                },
                {
                    subdomainOffset: 5,
                    expected: []
                }                                                  
            ];
    
            for (let item of sample) {
             
                config.subdomainOffset = item.subdomainOffset;
                
                const ctx = new Context(config, [], request, {});

                expect(ctx.subdomains).toEqual(item.expected);                   
            }                 
        });              
    });        
         
    describe('set statusCode', () => {
        
        it('should set the response statusCode', () => {
                   
            const request = { 
                url: '/controller/action',
            };

            const response = {};
      
            const ctx = new Context({}, [], request, response);
            
            const statusCode = 404;
            
            ctx.statusCode = statusCode;

            expect(response.statusCode).toEqual(statusCode);
        });
    });
    
    describe('set statusMessage', () => {
        
        it('should set the response statusMessage', () => {
                   
            const request = { 
                url: '/controller/action',
            };

            const response = {};
      
            const ctx = new Context({}, [], request, response);
            
            const statusMessage = Math.random().toString();
            
            ctx.statusMessage = statusMessage;

            expect(response.statusMessage).toEqual(statusMessage);
        });
    }); 
    
    describe('download', () => {
        
        it('should set the result and resolve', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const config = {
                applicationRoot: '/appRoot'
            };

            const ctx = new Context(config, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'resolve');
            
            const filePath = Math.random().toString();
            const filename = Math.random().toString();
            const contentType = Math.random().toString();
            const options = { a: Math.random(), b: Math.random() };
            
            ctx.download(filePath, filename, contentType, options);
            
            expect(ctx.result instanceof results.DownloadResult).toBeTruthy();
            expect(ctx.resolve).toHaveBeenCalled();
        });
    }); 
    
    describe('throw', () => {
        
        it('should set the result to null and reject', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const error = new Error();

            const ctx = new Context({}, [], request, {});

            ctx.reject = (err) => {};
            
            spyOn(ctx, 'reject');
            
            ctx.throw(error);
            
            expect(ctx.result).toBeNull();
            expect(ctx.reject).toHaveBeenCalledWith(error);
        });
    }); 
    
    describe('next', () => {
        
        it('should set the result to null and resolve', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'resolve');
            
            ctx.next();
            
            expect(ctx.result).toBeNull();
            expect(ctx.resolve).toHaveBeenCalled();
        });
    });  
    
    describe('redirect', () => {
        
        it('should set the result and resolve', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'resolve');
            
            const redirectUrl = '/redirect/url';
            const statusCode = 307;
            
            ctx.redirect(redirectUrl, statusCode);
            
            expect(ctx.result instanceof results.RedirectResult).toBeTruthy();
            expect(ctx.resolve).toHaveBeenCalled();
        });
    }); 

    describe('removeHeader', () => {
        
        it('should remove the response header and return the context', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const response = {
                removeHeader: () => {}
            }
            
            const ctx = new Context({}, [], request, response);
            
            spyOn(ctx.response, 'removeHeader');
            
            const headerName = 'X-Useless-Header';
            
            const result = ctx.removeHeader(headerName);
            
            expect(result).toEqual(ctx);
            expect(ctx.response.removeHeader).toHaveBeenCalledWith(headerName);
        });
    }); 
    
    describe('send', () => {
        
        it('should set the result and resolve', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'resolve');
            
            const body = 'Hello';
            const contentType = 'text/html';
            
            ctx.send(body, contentType);
            
            expect(ctx.result instanceof results.ContentResult).toBeTruthy();
            expect(ctx.resolve).toHaveBeenCalled();
        });
    });     
    
    describe('sendJSON', () => {
        
        it('should set the result and resolve', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'resolve');
            
            const body = 'Hello';
            
            ctx.sendJSON(body);
            
            expect(ctx.result instanceof results.JSONResult).toBeTruthy();
            expect(ctx.resolve).toHaveBeenCalled();
        });
    });  
    
    describe('sendJSONP', () => {
        
        it('should set the result and resolve', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'resolve');
            
            const data = { a: Math.random() };
            
            ctx.sendJSONP(data)
            
            expect(ctx.result instanceof results.JSONPResult).toBeTruthy();
            expect(ctx.resolve).toHaveBeenCalled();
        });
    }); 
    
    describe('sendFile', () => {
        
        it('should set the result and resolve', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'resolve');
            
            const filePath = 'dir1/dir2//file';
            const contentType = 'text/plain';
            const options = { root: process.cwd() };
            
            ctx.sendFile(filePath, contentType, options);
            
            expect(ctx.result instanceof results.FileResult).toBeTruthy();
            expect(ctx.resolve).toHaveBeenCalled();
        });
    }); 
       
    describe('sendStatus', () => {
        
        it('should set the status code and call send', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'send');
            
            const code = Math.random().toFixed();
            const message = Math.random().toString();
            
            ctx.sendStatus(code, message);
            
            expect(ctx.response.statusCode).toBe(code);
            expect(ctx.send).toHaveBeenCalledWith(message);
        });
        
        it('should set the status code and call send with default message', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const ctx = new Context({}, [], request, {});

            ctx.resolve = () => {};
            
            spyOn(ctx, 'send');
            
            const code = 503;
            
            ctx.sendStatus(code);
            
            expect(ctx.response.statusCode).toBe(code);
            expect(ctx.send).toHaveBeenCalledWith(http.STATUS_CODES[code]);
        });        
    }); 
    
    describe('setHeader', () => {
        
        it('should set the header', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const response = {
                setHeader(headerName, headerValue) {}
            }
            
            spyOn(response, 'setHeader');
            
            const ctx = new Context({}, [], request, response);
            
            const headerName = Math.random().toString();
            const headerValue = Math.random().toString();
            
            const result = ctx.setHeader(headerName, headerValue);
            
            expect(result).toBe(ctx);
            expect(ctx.response.setHeader).toHaveBeenCalledWith(headerName, headerValue);
        });
    });
    
    describe('setHeaders', () => {
        
        it('should set the headers (Object)', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const response = {
                setHeader(headerName, headerValue) {}
            }
            
            spyOn(response, 'setHeader');
            
            const ctx = new Context({}, [], request, response);
            
            const headersArray = [
                [Math.random().toString(), Math.random().toString()],
                [Math.random().toString(), Math.random().toString()],
                [Math.random().toString(), Math.random().toString()],
                [Math.random().toString(), Math.random().toString()],   
            ];
            
            const headers = {};

            for (let [name, value] of headersArray) {
                headers[name] = value;
            }
                     
            const result = ctx.setHeaders(headers);
            
            expect(result).toBe(ctx);
            expect(ctx.response.setHeader.calls.count()).toBe(headersArray.length);
            
            for (let i = 0; i < headersArray.length; i++) {
                expect(ctx.response.setHeader.calls.argsFor(i)).toEqual(headersArray[i]);
            }
        });
        it('should set the headers (Map)', () => {
                   
            const request = { 
                url: '/controller/action',
            };
            
            const response = {
                setHeader(headerName, headerValue) {}
            }
            
            spyOn(response, 'setHeader');
            
            const ctx = new Context({}, [], request, response);
            
            const headersArray = [
                [Math.random().toString(), Math.random().toString()],
                [Math.random().toString(), Math.random().toString()],
                [Math.random().toString(), Math.random().toString()],
                [Math.random().toString(), Math.random().toString()],   
            ];
                        
            const headers = new Map(headersArray);
                   
            const result = ctx.setHeaders(headers);
            
            expect(result).toBe(ctx);
            expect(ctx.response.setHeader.calls.count()).toBe(headers.size);
            
            // for (let entry of headers) {
            //     expect(ctx.response.setHeader.calls.argsFor(i)).toEqual(entry);
            // }
        });
    });                                                                                 
});